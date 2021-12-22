import Vue from "vue";
import Router from "vue-router";
import Home from "../views/Home.vue";
import Profile from "../views/Profile.vue";
import CreateRecipe from "../views/CreateRecipe.vue"
import UpdateRecipe from "../views/UpdateRecipe.vue"
import RecipePage from "../views/RecipePage.vue"
import { authGuard } from "../auth";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/profile",
      name: "profile",
      component: Profile,
      beforeEnter: authGuard
    },
    {
      path:"/createRecipe",
      name:"createRecipe",
      component: CreateRecipe,
      beforeEnter: authGuard
    },
    {
      path: "/updateRecipe/:recipeId",
      name: "Update Recipe",
      component: UpdateRecipe,
      beforeEnter: authGuard
    },
    {
      path:"/recipe/:recipeId",
      name: "Recipe Page",
      component: RecipePage,
      beforeEnter: authGuard
    }
  ]
});

export default router;
