<template>
    <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div class="md:col-span-3">
            <h2 class="h2">Update your recipe</h2>
            <div v-if="!isLoading">
                <div class="py-2">
                    <form class="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2">
                        <label for="recipeName" class="inputFormLabel">Recipe Name:</label>
                        <input v-model="name" type="text" class="inputText">
                        <label for="estimatedTime" class="inputFormLabel">Estimated Time:</label>
                        <input v-model.number="estimatedTime" type="number" class="inputText">
                        <label for="ingredients" class="inputFormLabel">Ingredients:</label>
                        <textarea v-model="ingredients" placeholder="Your ingredients" class="inputText"></textarea>
                        <label for="manual" class="inputFormLabel">The Manual:</label>
                        <textarea v-model="manual" placeholder="Your manual" class="inputText"></textarea>
                    </form>
                    <button  @click="updateRecipe" class="p-2 border rounded-md">Update Recipe</button>
                    <button @click="deleteRecipe" class="p-2 border rounded-md">Delete Recipe</button>
                </div>
            </div>
        </div>
        <div class="md:col-span-2">
            <h2 class="h2">Upload a picture</h2>
            <div>
                <div v-if="imgUrl">
                    <img :src="imgUrl" alt="">
                </div>
                <div class="py-4">
                    <input type="file" accept="image/*" placeholder="Image to upload" @change="onFileChange"/>
                    <button class="border rounded-lg p-2 font-light" @click="uploadFile">
                        {{ uploadButtonText }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
//import { getRecipe as api_getRecipe}  from '../api/api.js'
export default {
    setup() {
        
    },
    data(){
        return{
            recipe: {},
            name: "",
            estimatedTime: 0,
            ingredients: "",
            manual: "",
            isLoading: true,
            imgUrl: "",
            file: Buffer,
            uploadButtonText:"Upload photo",
        }
    },
    methods:{
        async getRecipe(){
            try{
                const tokenId = await this.$auth.getIdTokenClaims();
                const tokenIdRaw = tokenId.__raw
                const response = await this.$http.get(this.$api_endpoint+"/recipe/"+this.$route.params.recipeId,{
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${tokenIdRaw}`
                    }
                    });
                const recipe = response.data.item
                this.recipe = recipe
                this.name = recipe.name
                this.ingredients = recipe.ingredients
                this.estimatedTime = recipe.estimatedTime
                this.manual = recipe.manual
                this.imgUrl = recipe.attachmentUrl
                this.isLoading = false
            }catch(error){
                console.log(error)
            }
        },
        async updateRecipe(){
            try{
                const tokenId = await this.$auth.getIdTokenClaims();
                const tokenIdRaw = tokenId.__raw
                const body = this.formatBody()
                await this.$http.patch(this.$api_endpoint+"/recipe/"+this.$route.params.recipeId,JSON.stringify(body),{
                    headers:{
                        'Content-Type':'application/json',
                        'Authorization': `Bearer ${tokenIdRaw}`
                    }
                });
                window.alert("Recipe was updated, you will be redirected to home page.");
                this.$router.push('/')
            }catch(error){console.log(error)}
        },
        async deleteRecipe(){
            try{
                const tokenId = await this.$auth.getIdTokenClaims();
                const tokenIdRaw = tokenId.__raw
                await this.$http.delete(this.$api_endpoint+"/recipe/"+this.$route.params.recipeId,{
                    headers:{
                        'Content-Type':'application/json',
                        'Authorization': `Bearer ${tokenIdRaw}`
                    }
                })
                window.alert("Recipe was deleted")
                this.$router.push('/')
            }catch(error){
                console.log(error)
            }
        },
        formatBody(){
            return {
                name: this.name,
                estimatedTime: this.estimatedTime,
                ingredients: this.ingredients,
                manual: this.manual
            }
        },
        onFileChange(e){
            const file = e.target.files[0];
            this.imgUrl = URL.createObjectURL(file);

            //const reader = new FileReader();
            this.file = file //reader.readAsArrayBuffer(file)

        },
        async getUploadUrl(){
            const tokenId = await this.$auth.getIdTokenClaims();
            const tokenIdRaw = tokenId.__raw
            const response = await this.$http.post(`${this.$api_endpoint}/recipe/${this.$route.params.recipeId}/attachment`,'',{
                headers:{
                    'Content-Type':'application/json',
                    'Authorization': `Bearer ${tokenIdRaw}`
                }
            })
            return response.data.uploadUrl
        },
        async uploadFile(){
            if (this.imgUrl == this.recipe.attachmentUrl){
                console.log("SameFile no upload")
                return
            }
            try{
                this.uploadButtonText = " is uploading ..."
                const uploadUrl = await this.getUploadUrl()
                await this.$http.put(uploadUrl,this.file)
                console.log("Uploaded Image")
                this.uploadButtonText = "Photo uploaded"
            }catch(e){
                console.log(e)
                this.uploadButtonText = "Error"
            }
            
        }
    },
    beforeRouteEnter(to,from,next){
        next(vm => vm.getRecipe())
    },
    beforeRoute(to,from,next){
        this.getRecipe()
        next()
    }
}
</script>
<style scoped>
@tailwind base;
@tailwind utilities;
    .inputText{
        @apply bg-gray-200 border text-base font-light px-2 items-center
    }
    .inputFormLabel{
        @apply font-sans font-light text-lg
    }

    .h2{
        @apply font-sans font-extralight text-2xl
    }
</style>