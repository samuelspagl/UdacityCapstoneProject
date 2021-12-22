import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)

import { RecipeItem } from '../models/RecipeItem'
import { RecipeUpdate } from '../models/RecipeUpdate'

const logger = createLogger('recipeAccess')


export class RecipeAccess{
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly recipeTable = process.env.RECIPE_TABLE,
        private readonly recipeByUserIndex = process.env.RECIPE_BY_USER_INDEX){}
    
    async createRecipeItem(item: RecipeItem): Promise<RecipeItem>{
        logger.info(`Sending new RecipeItem to Database`, item)
        await this.docClient.put({
            TableName: this.recipeTable,
            Item: item
        }).promise()
        return item
    }

    async updateRecipeItem (item: RecipeUpdate, recipeId, userId:string): Promise<RecipeItem>{
        logger.info(`RecipeAcess: Starting updating recipeId: ${recipeId} of UserId ${userId}`)
        try{
            await this.docClient.update({
                TableName: this.recipeTable,
                Key: {
                    recipeId: recipeId,
                    userId: userId
                },
                UpdateExpression: "set #name = :name, manual = :manual, updatedAt = :updatedAt, estimatedTime = :estimatedTime, ingredients = :ingredients",
                ExpressionAttributeNames: {
                    "#name": "name"
                  },
                ExpressionAttributeValues:{
                    ":name" : item.name,
                    ":manual":item.manual,
                    ":updatedAt": new Date().toISOString(),
                    ":estimatedTime": item.estimatedTime,
                    ":ingredients": item.ingredients
                },
                ReturnValues: "UPDATED_NEW"
            }).promise()
            logger.info("Updating successfull")
            return item as RecipeItem
        }catch(err) {
            logger.error(`Error updating: ${err}`)
        }
        
    }

    async getRecipeForUser(userId:string): Promise<RecipeItem[]>{
        const result = await this.docClient.query({
            TableName: this.recipeTable,
            IndexName: this.recipeByUserIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues:{
                ':userId': userId
            },
            ScanIndexForward: false
        }).promise()

        return result.Items as RecipeItem[]
    }

    async getRecipeById(recipeId: string): Promise<RecipeItem>{
        const result = await this.docClient.query({
            TableName: this.recipeTable,
            KeyConditionExpression: 'recipeId = :recipeId',
            ExpressionAttributeValues: {
                ':recipeId': recipeId
            }
        }).promise()
        return result.Items[0] as RecipeItem
    }

    async deleteRecipeItem(recipeId: string, userId: string): Promise<Object>{
        logger.info(`Trying to delete the item`)
        var deleteSucceeded = true
        try{
            await this.docClient.delete({
                TableName: this.recipeTable,
                Key:{
                    recipeId: recipeId,
                    userId: userId
                }
            }).promise()
            return {deleteSucceeded}
        }catch(e){
            return {deleteSucceeded: deleteSucceeded, errData: e}
        }
    }

    async updateAttUrl(recipeId: string,userId:string, attUrl: string){
        logger.info(`Updating the recipeId ${recipeId} with the url ${attUrl}`)

        try{
            await this.docClient.update({
                TableName: this.recipeTable,
                Key: {
                    recipeId: recipeId,
                    userId: userId
                },
                UpdateExpression: "set attachmentUrl = :attachmentUrl",
                ExpressionAttributeValues:{
                    ':attachmentUrl' : attUrl
                }
            }).promise()
        }catch(e){
            logger.error('An Error occurred while updating recipe ID with new URL', e)
        }
    }
}


function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log('Creating a local DynamoDB instance')
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
  
    return new XAWS.DynamoDB.DocumentClient()
  }
  