import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateRecipeRequest } from '../../requests/CreateRecipeRequest'
import { getUserId } from '../utils';
import { createRecipe } from '../../businessLogic/recipes'


import { createLogger } from '../../utils/logger'
const logger = createLogger('createRecipe')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newRecipe: CreateRecipeRequest = JSON.parse(event.body)
    const userId = getUserId(event)
    logger.info(`Received the request to create a recipe by ${userId}`, newRecipe)

    //Creating a new Item and pushing it into the Database
    const newItem = await createRecipe(newRecipe, userId)
    logger.info(`Creating the recipe was successfull`, newItem)
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item: newItem
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
