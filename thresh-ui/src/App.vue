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
  <a href="#/">Home</a> | <a href="#/create-account">Create an account</a> | <a href="#/remove-restaurant">Remove a restaurant</a> |
  <component :is="currentView" />
</template>