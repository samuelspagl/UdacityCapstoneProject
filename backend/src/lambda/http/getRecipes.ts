import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getRecipesForUser as getRecipesForUser } from '../../businessLogic/recipes'
import { getUserId } from '../utils';

import { createLogger } from '../../utils/logger'
const logger = createLogger('deleteRecipe')

// DONE: Get all to-do items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event)
    logger.info(`Received the request to fetch all recipies for the user ${userId}`)
    const recipes = await getRecipesForUser(userId)
    logger.info(`Fetching all of the recipes for user ${userId} was successfull`, recipes)
    return {
      statusCode: 200,
      body: JSON.stringify({items: recipes})
    }
  })
handler.use(
  cors({
    credentials: true
  })
)
