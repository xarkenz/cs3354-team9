<script setup>
//From the Vue documentation: https://vuejs.org/guide/scaling-up/routing.html#official-router
import { ref, computed } from 'vue'
import NotFound from './pages/NotFound.vue'
import Home from './pages/Home.vue'
import AccountCreation from './pages/AccountCreation.vue'
import SignIn from './pages/SignIn.vue'
import RemoveRestaurant from './pages/RemoveRestaurant.vue'
import FilterSearch from './pages/FilterSearch.vue'
import ViewAllergens from './pages/ViewAllergens.vue'

const routes = {
  '/': Home,
  '/create-account': AccountCreation,
  '/sign-in': SignIn,
  '/remove-restaurant': RemoveRestaurant,
  '/filter-search': FilterSearch,
  '/view-allergens': ViewAllergens,
}

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/'] || NotFound
})
</script>

<template>
  <div>
    <header class="sticky top-0 left-0 right-0 p-2 border-b-2 border-slate-300">
      <nav>
        <ul class="flex items-center gap-x-5">
          <li><a href="#/" class="flex items-center gap-x-3 mr-auto"><img src="./assets/THRESH textual logo.png"><img class="size-18" src="./assets/Thresh circular logo.png"></a></li>
          <li><a href="#/create-account" class="px-2 py-2 rounded-md outline-green-950 outline-2 text-slate-50 bg-green-950">Sign Up</a></li>
          <li><a href="#/sign-in" class="px-2 py-2 rounded-md outline-green-950 outline-2 text-green-950">Sign In</a></li>
        </ul>
      </nav>
    </header>
    <main>
      <component :is="currentView" class="container mx-auto p-6"/> <!--This is replaced with the HTML of each given page (via VueJS)-->
    </main>
  </div>
</template>