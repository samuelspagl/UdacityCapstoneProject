/**
 * Fields in a request to create a single TODO item.
 */
export interface CreateRecipeRequest {
  name: string
  estimatedTime: number
  ingredients: string
  manual: string
}
