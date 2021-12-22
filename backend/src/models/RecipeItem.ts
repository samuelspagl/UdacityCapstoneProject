export interface RecipeItem {
  userId: string
  recipeId: string
  createdAt: string
  updatedAt?: string
  sharedWith?: Array<string>
  name: string
  estimatedTime: number
  ingredients: string //TODO Array<{weight: string, ingredient: string}> 
  manual: string
  imgUrl?: string
}
