<template>
    <div v-if="!isLoading">
        <div class="w-full max-w-screen-2xl max-h-96 h-full flex">
            <img :src="imgUrl" alt="" class="object-cover rounded-2xl">
        </div>
        <div class="py-5">
            <h2 class=" text-3xl font-extralight">{{name}}</h2>
            <div class="divide-y">
                <div class="flex py-3">
                    <p class="font-extralight">Estimated Time of Cooking: {{estimatedTime}}</p>
                </div>
                <div class="py-3">
                    <h5 class="text-xl font-extralight">Ingredients:</h5>
                    <p class="font-extralight">{{ingredients}}</p>
                </div>
                <div class="py-3">
                    <h5 class="text-xl font-extralight">Manual:</h5>
                    <p class="font-extralight">{{ manual }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
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