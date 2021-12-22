import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'
import { decode, verify } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import { JwtPayload } from '../../auth/JwtPayload'
import axios from 'axios'
import { Jwt } from '../../auth/Jwt'

const logger = createLogger('auth')

let cachedCert

const jwksUrl = process.env.JWKS_URL

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}



async function verifyToken(authHeader: string): Promise<JwtPayload> {
  // Starting by accessing the token from the authHeader
  const token = getToken(authHeader)
  logger.info(`Verifying ${token}`)

  // if there is no jwt token, throw the invalid token error
  const jwt: Jwt = decode(token, { complete: true }) as Jwt
  if(!jwt){
    throw new Error('invalid token')
  }

  // fetch the validation certificate from the auth0 servers
  const cert = await getCert()
  logger.info(`Received cert:\n ${cert}`)

  // Veryfing that the token is valid 
  return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
}


// This is a function to retrieve the token from the authenticiation header
function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}



// This is a function to fetch the signing certificate from the auth0 servers and create needed certifacet
async function getCert(): Promise<string> {
  // if there is already a certificate
  if (cachedCert) return cachedCert

  logger.info(`Fetching certificate from ${jwksUrl}`)
  const response = await axios.get(jwksUrl)
  const keys = response.data.keys
  if (!keys || !keys.length)
    throw new Error('No JWKS keys found')
  
  logger.info(`Received the keys from Auth0`)

  const signingKeys = keys.filter(
    key => key.use === 'sig'
           && key.kty === 'RSA'
           && key.alg === 'RS256'
           && key.n
           && key.e
           && key.kid
           && (key.x5c && key.x5c.length)
  )


  if (!signingKeys.length)
    throw new Error('No JWKS signing keys found')
  
  logger.info('Signing keys were found')

  const key = signingKeys[0]
  const pub = key.x5c[0]  // public key
  logger.info(`Public key was extracted from the keys: \n ${pub}`)
  // Certificate found!
  cachedCert = certToPEM(pub)
  logger.info('Auth0 certificate was created and saved to cache', cachedCert)

  return cachedCert
}

function certToPEM(cert:string){
  cert = cert.match(/.{1,64}/g).join('\n')
  cert = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`
  return cert
}

