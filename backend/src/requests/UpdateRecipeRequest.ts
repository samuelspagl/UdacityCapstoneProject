/**
 * Fields in a request to create a single TODO item.
 */
 export interface UpdateRecipeRequest {
  name: string
  estimatedTime: number
  ingredients: string
  manual: string
}
