<script setup>
//From the Vue documentation: https://vuejs.org/guide/scaling-up/routing.html#official-router
import { ref, computed } from 'vue'
import Home from './pages/Home.vue'
import AccountCreation from './pages/AccountCreation.vue'
import NotFound from './pages/NotFound.vue'
import RemoveRestaurant from './RemoveRestaurant.vue'

const routes = {
  '/': Home,
  '/create-account': AccountCreation,
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
  <header>
    <div>
      <a href="#/"><span>Thresh</span></a>
      <nav>
        <ul>
          <li><a href="#/">Home</a></li>
          <li><a href="#/create-account">Create an account</a></li>
          <li><a href="#/remove-restaurant">Remove a restaurant</a></li>
        </ul>
      </nav>
    </div>
  </header>
  <component :is="currentView" />
</template>