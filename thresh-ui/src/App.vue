<script setup>
//From the Vue documentation: https://vuejs.org/guide/scaling-up/routing.html#official-router
import { ref, computed } from 'vue'
import Home from './pages/Home.vue'
import AccountCreation from './pages/AccountCreation.vue'
import NotFound from './pages/NotFound.vue'
import RemoveRestaurant from './RemoveRestaurant.vue'
import SignIn from './pages/SignIn.vue'

const routes = {
  '/': Home,
  '/create-account': AccountCreation,
  '/sign-in': SignIn,
  '/remove-restaurant': RemoveRestaurant
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
  <div class="container w-full"> <!--this prevents the header from being to the left of the body but also puts everything on the left half of the page-->
    <header class="align-top">
      <div class = "flex items-center gap-x-3">
        <nav>
          <ul class = "flex items-center gap-x-3">
            <li><a href="#/sign-in" class="px-1 py-2 rounded-md">Sign In</a></li>
            <li><a href="#/create-account" class="px-1 py-2 rounded-md">Sign Up</a></li>
            <li><a href="#/remove-restaurant" class="px-1 py-2 rounded-md">Remove a restaurant</a></li> <!-- This should later be moved to only be accessible by admins-->
            <li><a href="#/" class = "flex items-center gap-x-3 mr-auto"><img src="./assets/THRESH textual logo.png"><img class = "size-24" src="./assets/Thresh circular logo.png"></a></li>
          </ul>
        </nav>
      </div>
    </header>

    <component :is="currentView"/> <!-- This is replaced with the HTML of each given page (via VueJS)-->
  </div>
</template>