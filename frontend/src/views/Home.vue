<template>
  <div>
    <!-- <hero />
    <hr />
    <home-content /> -->
    <!-- <div>
      <button @click="getRecipes">stuff</button>
      <p>{{recipes}}</p>
    </div> -->
    <h2 class=" font-extralight text-3xl">My recipes</h2>
    <div class="p-10 grid divide-y divide-solid">
      <div v-for="recipe in recipes.items" :key="recipe.recipeId" class="py-5">
        <singleRecipe :recipeJson="recipe"/>
      </div>
    </div>
  </div>
</template>

<script>
import Hero from "../components/Hero";
import HomeContent from "../components/HomeContent";
import singleRecipe from "../components/singleRecipe.vue"

export default {
  name: "home",
  components: {
    Hero,
    HomeContent,
    singleRecipe
  },
  created(){
    this.$root.$refs.home = this
  },
  watch:{
    '$auth.isAuthenticated' () {
      this.getRecipes()
    }
  },
  data(){
    return{
      recipes: Object
    }
  },
  beforeRouteEnter(to,from,next){
    next(vm => vm.getRecipes())
  },
  beforeRouteUpdate(to,from,next){
    this.getRecipes()
    next()
  },
  methods: {
    async getRecipes(){
      if (!this.$auth.isAuthenticated){
        return
      }
      try{
        const tokenId = await this.$auth.getIdTokenClaims();
        const tokenIdRaw = tokenId.__raw

        const response = await this.$http.get(this.$api_endpoint+"/recipes/",{
          headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenIdRaw}`
          }
        });
        console.log(response.data)
        this.recipes = response.data;
      }catch(error){
        console.log(error)
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.next-steps {
  .fa-link {
    margin-right: 5px;
  }
}
</style>
