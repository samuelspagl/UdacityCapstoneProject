<template>
    <div>
        <h1 class="text-xl font-bold">Create your Recipe</h1>
        <div>
            <form class="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2">
                <label for="recipeName" class="inputFormLabel">Recipe Name:</label>
                <input v-model="recipeName" type="text" class="inputText">
                <label for="estimatedTime" class="inputFormLabel">Estimated Time:</label>
                <input v-model.number="estimatedTime" type="number" class="inputText">
                <label for="ingredients" class="inputFormLabel">Ingredients:</label>
                <textarea v-model="ingredients" placeholder="Your ingredients" class="inputText"></textarea>
                <label for="manual" class="inputFormLabel">The Manual:</label>
                <textarea v-model="manual" placeholder="Your manual" class="inputText"></textarea>
                <label for="image" class="inputFormLabel">Select Image: </label>
                <input type="file" accept="image/*" placeholder="Image to upload" @change="onFileChange" class="inputText"/>
            </form>
            <button @click="uploadRecipe" class=" text-md font-thin bg-gray-200 hover:bg-red-400 p-2 rounded-2xl">{{submitButtonText}}</button>
        </div>
    </div>
</template>

<script>

import Hero from "../components/Hero";
import HomeContent from "../components/HomeContent";
import singleRecipe from "../components/singleRecipe.vue"

export default {
    name: "createRecipe",
    components: {
        Hero,
        HomeContent,
        singleRecipe
    },
    data(){
        return {
            recipeName: '',
            estimatedTime: 0,
            ingredients:'',
            manual: '',
            submitButtonText: 'Submit Recipe',
            recipe: {},
            imgUrl: ''
        }
    },
    setup() {
        
    },
    methods:{
        async uploadRecipe(){
            const body = this.formatRequestBody();
            console.log(body);
            try{
                this.submitButtonText = "Uploading Recipe..."
                const tokenId = await this.$auth.getIdTokenClaims();
                const tokenIdRaw = tokenId.__raw

                const response = await this.$http.post(
                    "https://lr6eyt4wv1.execute-api.eu-central-1.amazonaws.com/dev/recipe",
                    JSON.stringify(body),
                    {
                        headers:{
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${tokenIdRaw}`
                        },
                    });
                console.log(response.data.item)
                this.recipe = response.data.item;
                
                if (imgUrl != ''){
                    await this.uploadFile(this.recipe.recipeId)
                }
                window.alert("Recipe was successfully created.\nYou will be redirected to home.")
                this.$router.push('/')
            }catch(error){
                console.log(error)
            }
        },
        onFileChange(e){
            const file = e.target.files[0];
            this.imgUrl = URL.createObjectURL(file);

            //const reader = new FileReader();
            this.file = file //reader.readAsArrayBuffer(file)

        },
        async getUploadUrl(recipeId){
            const tokenId = await this.$auth.getIdTokenClaims();
            const tokenIdRaw = tokenId.__raw
            const response = await this.$http.post(`${this.$api_endpoint}/recipe/${recipeId}/attachment`,'',{
                headers:{
                    'Content-Type':'application/json',
                    'Authorization': `Bearer ${tokenIdRaw}`
                }
            })
            return response.data.uploadUrl
        },
        async uploadFile(recipeId){
            try{
                this.uploadButtonText = " is uploading ..."
                const uploadUrl = await this.getUploadUrl(recipeId)
                await this.$http.put(uploadUrl,this.file)
                console.log("Uploaded Image")
            }catch(e){
                console.log(e)
            }     
        
        },
        formatRequestBody(){
            let body = {
                name: this.recipeName,
                estimatedTime: this.estimatedTime,
                ingredients: this.ingredients,
                manual: this.manual
            };
            return body
        }
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
</style>