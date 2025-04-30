<script setup>
// From the Vue documentation: https://vuejs.org/guide/scaling-up/routing.html#official-router
import { ref, computed } from 'vue'
import { useCookies } from 'vue3-cookies'
import NotFound from './pages/NotFound.vue'
import Home from './pages/Home.vue'
import AccountCreation from './pages/AccountCreation.vue'
import SignIn from './pages/SignIn.vue'
import RateRestaurant from './pages/RateRestaurant.vue'
import RemoveRestaurant from './pages/RemoveRestaurant.vue'
import FilterSearch from './pages/FilterSearch.vue'
import ViewAllergens from './pages/ViewAllergens.vue'
import AccountSettings from './pages/AccountSettings.vue'
import User from './pages/User.vue'
import SaveFavoriteRestaurant from './pages/SaveFavoriteRestaurant.vue'
import Map from './pages/Map.vue'
import Profile from './pages/Profile.vue'
import ReportIncorrectAllergy from './pages/ReportIncorrectAllergy.vue'
import ManageRestaurants from './pages/ManageRestaurants.vue'
import ManageAllergens  from './pages/ManageAllergens.vue'

import { MapIcon, MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/vue/24/outline'

const { cookies } = useCookies()

async function fetchUser() {
  const sessionToken = cookies.get('session')
  if (!sessionToken) return null

  const headers = new Headers()
  headers.append("Content-Type", "application/json")
  headers.append("mycookies", `session=${sessionToken}`)

  try {
    const response = await fetch("http://localhost:3000/api/whoami", {
      method: "GET",
      headers
    })
    const body = await response.json()
    return body.user
  } catch {
    return null
  }
}

const currentUser = ref(null)
fetchUser().then(u => currentUser.value = u)

const routes = {
  '': Home,
  'create-account': AccountCreation,
  'sign-in': SignIn,
  'remove-restaurant': RemoveRestaurant,
  'report-incorrect-allergy': ReportIncorrectAllergy,
  'filter-search': FilterSearch,
  'view-allergens': ViewAllergens,
  'account-settings': AccountSettings,
  'save-favorite-restaurant': SaveFavoriteRestaurant,
  'map': Map,
  'profile': Profile,
  'rate-restaurant': RateRestaurant,
  'manage-restaurants': ManageRestaurants,
  'manage-allergens': ManageAllergens,
  'user': User
}

const currentPath = ref(window.location.hash)

const currentView = computed(() => {
  const match = currentPath.value.match(/^#\/?([^/]*)/)
  const path = match ? match[1] : ''
  return routes[path] || NotFound
})

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
  fetchUser().then(u => currentUser.value = u)
})

const username = computed(() => currentUser.value?.username)
</script>

<template>
  <div>
    <header class="sticky top-0 left-0 right-0 p-2 border-b-2 border-slate-300 z-50 bg-white">
      <nav>
        <ul class="flex items-center gap-x-5 mx-6">
          <!-- Logo -->
          <li>
            <a href="#/" class="flex items-center gap-x-3">
              <img class="h-6" src="./assets/Thresh circular logo.png" />
              <img src="./assets/THRESH textual logo.png" />
            </a>
          </li>

          <div class="ml-auto flex items-center gap-x-3">
            <!-- Map Icon -->
            <a href="#/map" class="hover:text-green-700">
              <MapIcon class="w-8 h-8 text-green-950" />
            </a>

            <!-- Search Icon -->
            <a href="#/filter-search" class="hover:text-green-700">
              <MagnifyingGlassIcon class="w-8 h-8 text-green-950" />
            </a>

            <!-- If NOT logged in: Sign Up / Sign In -->
            <template v-if="!username">
              <a href="#/create-account"
                 class="px-2 py-2 rounded-md text-white bg-green-950 hover:bg-green-800 transition">
                Sign Up
              </a>
              <a href="#/sign-in"
                 class="px-2 py-2 rounded-md text-green-950 hover:bg-green-100 transition">
                Sign In
              </a>
            </template>

            <!-- If logged in: Username & Profile -->
            <template v-else>
              <a href="#/profile" class="flex items-center gap-x-2">
                <div class="text-lg font-semibold text-green-950">{{ username }}</div>
                <UserCircleIcon class="w-9 h-9 text-green-950" />
              </a>
            </template>
          </div>
        </ul>
      </nav>
    </header>

    <main class="w-full">
      <component :is="currentView" :currentUser="currentUser" />
    </main>
  </div>
</template>

<script>
export default { name: 'App' }
</script>

