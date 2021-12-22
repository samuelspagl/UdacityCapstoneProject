import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateRecipe } from '../../businessLogic/recipes'
import { UpdateRecipeRequest } from '../../requests/UpdateRecipeRequest'
import { getUserId } from '../utils'


import { createLogger } from '../../utils/logger'
const logger = createLogger('updateRecipe')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    //Fetching all the nescessary variables from the body, or path
    const recipeId = event.pathParameters.recipeId
    const updatedRecipe: UpdateRecipeRequest = JSON.parse(event.body)
    const userId = getUserId(event)
    logger.info(`Received the request to update recipe ${recipeId} from user ${userId}`, updatedRecipe)
    // starting the updating process
    const newRecipe = await updateRecipe(updatedRecipe, recipeId, userId)
    logger.info(`Updating the recipe ${recipeId} was successfull`, newRecipe)
    return {
      statusCode: 200,
      body: JSON.stringify({updatedContent: newRecipe})
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
