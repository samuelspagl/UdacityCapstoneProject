export interface RecipeUpdate {
  updatedAt?: string
  sharedWith?: Array<string>
  name: string
  estimatedTime: number
  ingredients: string //TODO Array<{weight: string, ingredient: string}> //For purpose of easyness ill just use a string and not the array 
  manual: string
}
