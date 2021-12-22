import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { CreateRecipeRequest } from '../requests/CreateRecipeRequest'
import * as uuid from 'uuid'
import { RecipeAccess } from '../dataLayer/recipesAccess'
import { RecipeItem } from '../models/RecipeItem'
import { UpdateRecipeRequest } from '../requests/UpdateRecipeRequest'
import { getAttachmentUrl } from '../dataLayer/attachmentUtils'


const recipeAccess = new RecipeAccess()
const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({
    signatureVersion: 'v4'
  })

const bucketName = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export function createAttachmentPresignedUrl(recipeId: string): string {
    return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: recipeId,
        Expires: urlExpiration
      })
}

export async function getRecipe(userId: string, recipeId: string){
  console.log(userId)
  return await recipeAccess.getRecipeById(recipeId,)
}

export async function deleteRecipe(recipeId, userId):Promise<Object> {
  console.log(userId)
  return await recipeAccess.deleteRecipeItem(recipeId, userId)
}

export async function createRecipe(createRecipeRequest:CreateRecipeRequest, userId): Promise<RecipeItem> {
  const recipeId = uuid.v4()
  const createdAt = new Date().toISOString()
  return await recipeAccess.createRecipeItem({
  userId: userId,
  recipeId: recipeId,
  createdAt: createdAt,
  name: createRecipeRequest.name,
  estimatedTime: createRecipeRequest.estimatedTime,
  ingredients: createRecipeRequest.ingredients,
  manual: createRecipeRequest.manual,
})
}

export async function getRecipesForUser(userId: string): Promise<RecipeItem[]> {
  return recipeAccess.getRecipeForUser(userId)
}


export async function updateRecipe(updateRecipeRequest: UpdateRecipeRequest, recipeId: string, userId:string): Promise<RecipeItem>{
  return await recipeAccess.updateRecipeItem(updateRecipeRequest, recipeId, userId)
}

export async function updateRecipeAttUrl(recipeId:string, userId, attId:string){
  const item = await recipeAccess.getRecipeById(recipeId)
  if(!item){
    throw new Error("recipeId was not found in the system")
  }

  if(userId != item.userId){
    throw new Error("User is not the owner of the specified task.")
  }
  const attUrl = await getAttachmentUrl(attId)
  return await recipeAccess.updateAttUrl(recipeId,userId, attUrl)
}