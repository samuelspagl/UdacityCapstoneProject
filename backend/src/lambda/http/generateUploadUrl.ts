import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import * as uuid from 'uuid'
import { createAttachmentPresignedUrl, updateRecipeAttUrl } from '../../businessLogic/recipes'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('generateUploadURL')


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const recipeId = event.pathParameters.recipeId
    const userId = getUserId(event)
    const attId = uuid.v4()
    logger.info(`Received the request to generate an upload URL and update the recipe.\n RecipeId: ${recipeId}, UserId: ${userId}`)
    const url = createAttachmentPresignedUrl(attId)
    logger.info(`Creating the upload url was successfull. \n url: ${url}`)
    await updateRecipeAttUrl(recipeId, userId, attId)
    logger.info(`Updating the recipe with an image adress was successfull.`)
    return {
      statusCode: 200,
      body:JSON.stringify({
        uploadUrl: url
      })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
