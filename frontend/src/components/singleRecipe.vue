<template>
    <div class="grid grid-cols-5 grid-flow-row gap-5">
        <div v-if="recipeJson.attachmentUrl != ''" class="col-span-1">
            <div class="h-full w-full flex">
                <img :src=recipeJson.attachmentUrl alt="" class="object-cover rounded-xl">
            </div> 
        </div>
        <div class="col-span-3">
            <router-link :to="{ name: 'Recipe Page', params: {recipeId: recipeJson.recipeId}}" class=" hover:text-blue-500">
                <h4 class=" text-xl font-light">{{recipeJson.name}}</h4>
            </router-link>
            <p class="font-extralight">
                <font-awesome-icon :icon="['fas', 'clock']" />:{{recipeJson.estimatedTime}} min</p>
            <div>
            </div>
        </div>
        <div>
            <div>
                <button>
                    <router-link :to="{ name: 'Update Recipe', params: {recipeId: recipeJson.recipeId}}" class="hover:text-blue-400">
                        <font-awesome-icon :icon="['fas', 'edit']" /> edit
                    </router-link>
                </button>
            </div>
            <div>
                <button @click="deleteRecipe" class="hover:text-blue-400">
                    <font-awesome-icon :icon="['fas', 'trash']" /> delete
                </button>
            </div>
        </div>
    </div>
</template>


<script>
export default {
    setup() {
        
    },
    props: ['recipeJson'],
    methods:{
        async deleteRecipe(){
            try{
                const tokenId = await this.$auth.getIdTokenClaims();
                const tokenIdRaw = tokenId.__raw
                await this.$http.delete(this.$api_endpoint+"/recipe/"+this.recipeJson.recipeId,{
                    headers:{
                        'Content-Type':'application/json',
                        'Authorization': `Bearer ${tokenIdRaw}`
                    }
                })
                window.alert("Recipe was deleted")
                this.$root.$refs.home.getRecipes();
            }catch(error){
                console.log(error)
            }
        }
    }
}
</script>