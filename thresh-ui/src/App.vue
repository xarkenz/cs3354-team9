<script setup>
//From the Vue documentation: https://vuejs.org/guide/scaling-up/routing.html#official-router
import { ref, computed } from 'vue'
import NotFound from './pages/NotFound.vue'
import Home from './pages/Home.vue'
import AccountCreation from './pages/AccountCreation.vue'
import SignIn from './pages/SignIn.vue'
import RemoveRestaurant from './pages/RemoveRestaurant.vue'
import RateRestaurant from './pages/RateRestaurant.vue'
import FilterSearch from './pages/FilterSearch.vue'
import ViewAllergens from './pages/ViewAllergens.vue'
import DeleteAccount from './pages/DeleteAccount.vue'
import BanUser from './pages/BanUser.vue'
import SaveFavoriteRestaurant from './pages/SaveFavoriteRestaurant.vue'
import Map from './pages/Map.vue'
import Profile from './pages/Profile.vue'

const routes = {
  '/': Home,
  '/create-account': AccountCreation,
  '/sign-in': SignIn,
  '/remove-restaurant': RemoveRestaurant,
  '/filter-search': FilterSearch,
  '/view-allergens': ViewAllergens,
  '/rate-restaurant': RateRestaurant,
  '/delete-account': DeleteAccount,
  '/ban-user': BanUser,
  '/save-favorite-restaurant': SaveFavoriteRestaurant,
  '/map': Map,
  '/profile': Profile,
}

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

const currentView = computed(() => {
  const path = currentPath.value.slice(1) || '/';

  // Support dynamic route: /rate-restaurant/:id
  if (path.startsWith('rate-restaurant/')) {
    return RateRestaurant;
  }

  // Support dynamic route: /view-allergens/:id
  if (path.startsWith('view-allergens/')) {
    return ViewAllergens;
  }

  return routes[path] || NotFound;
});

</script>

<template>
  <div>
    <header class="sticky top-0 left-0 right-0 p-2 border-b-2 border-slate-300">
      <nav>
        <ul class="flex items-center gap-x-5 mx-5">
          <li><a href="#/" class="flex items-center gap-x-3 mr-auto"><img class="size-18" src="./assets/Thresh circular logo.png"><img src="./assets/THRESH textual logo.png"></a></li>
          <li class="ml-auto flex items-center gap-x-5">
            <a href="#/create-account" class="px-2 py-2 rounded-md outline-green-950 outline-2 text-slate-50 bg-green-950">Sign Up</a>
            <a href="#/sign-in" class="px-2 py-2 rounded-md outline-green-950 outline-2 text-green-950">Sign In</a>
            <a href="#/profile"><img class = "ml-auto flex items-center size-18" src="./assets/profile.png"></a>
          </li>
        </ul>
      </nav>
    </header>
    <!-- I need to display these two navbars conditionally somehow, upon this condition: v-if='sessionToken.length===0' -->
    <!-- <header v-else class="sticky top-0 left-0 right-0 p-2 border-b-2 border-slate-300">
      <nav>
        <ul class="flex items-center gap-x-5 mx-5">
          <li><a href="#/" class="flex items-center gap-x-3 mr-auto"><img class="size-18" src="./assets/Thresh circular logo.png"><img src="./assets/THRESH textual logo.png"></a></li>
          <li><a href="#/profile"><img class = "ml-auto flex items-center size-18" src="./assets/profile.png"></a></li>
        </ul>
      </nav>
    </header> -->
    <main class="w-full">
      <component :is="currentView" />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
  // data() {
  //   return {
  //     sessionToken: this.$cookies.get("session"),
  //   };
  // }
}
</script>