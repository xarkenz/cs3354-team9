<script setup>
//From the Vue documentation: https://vuejs.org/guide/scaling-up/routing.html#official-router
import { ref, computed } from 'vue'
import NotFound from './pages/NotFound.vue'
import Home from './pages/Home.vue'
import AccountCreation from './pages/AccountCreation.vue'
import SignIn from './pages/SignIn.vue'
import RemoveRestaurant from './pages/RemoveRestaurant.vue'
import FilterSearch from './pages/FilterSearch.vue'

const routes = {
  '/': Home,
  '/create-account': AccountCreation,
  '/sign-in': SignIn,
  '/remove-restaurant': RemoveRestaurant,
  '/filter-search': FilterSearch,
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
  <div class="container w-screen bg-slate-50 text-black"> <!--this prevents the header from being to the left of the body but also puts everything on the left half of the page-->
    <header class="align-top">
      <div class="flex items-center justify-between gap-x-3 px-5 outline-1 container">
        <nav>
          <ul class="flex items-center gap-x-3">
            <li class="justify-start"><a href="#/" class = "flex items-center gap-x-3 mr-auto"><img src="./assets/THRESH textual logo.png"><img class="size-18" src="./assets/Thresh circular logo.png"></a></li>
            <li><a href="#/sign-in" class="justify-end px-2 py-2 rounded-md outline-green-950 outline-2 text-green-950">Sign In</a></li>
            <li><a href="#/create-account" class="justify-end px-2 py-2 rounded-md outline-green-950 outline-2 text-slate-50 bg-green-950">Sign Up</a></li>
          </ul>
        </nav>
      </div>
    </header>

    <component :is="currentView" class="bg-slate-50 text-black justify-center"/> <!--This is replaced with the HTML of each given page (via VueJS)-->
  </div>
</template>