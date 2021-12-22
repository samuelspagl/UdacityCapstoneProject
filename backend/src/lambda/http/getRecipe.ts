import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getRecipe as getRecipe } from '../../businessLogic/recipes'
import { getUserId } from '../utils';

import { createLogger } from '../../utils/logger'
const logger = createLogger('getRecipe')

export const handler = middy(
    async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const userId = getUserId(event)
        const recipeId = event.pathParameters.recipeId
        logger.info(`Received the request to fetch a single recipe for the user ${userId}`)

        const recipe = await getRecipe(userId, recipeId)
        logger.info(`Fetching the recipe of user ${userId} was successfull`, recipe)
        return{ 
            statusCode: 200,
            body: JSON.stringify({item: recipe})
        }
    }
)

handler.use(
    cors({
        credentials:true
    })
)