import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteRecipe } from '../../businessLogic/recipes'
import { getUserId } from '../utils'

import { createLogger } from '../../utils/logger'
const logger = createLogger('deleteRecipe')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const recipeId = event.pathParameters.recipeId
    const userId = getUserId(event)
    logger.info(`Received the request to delete the recipe ${recipeId} by ${userId}`)

    const response = await deleteRecipe(recipeId, userId)
    logger.info(`Deleting the recipe was successfull`)
    if (!response['deleteSucceeded']){
      return{
        statusCode: 400,
        body: JSON.stringify({Error: response['errData']})
      }
    }
    return {
      statusCode: 200,
      body: JSON.stringify("Deleted Item ")
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



  //Check if the Recipe is part of the user
