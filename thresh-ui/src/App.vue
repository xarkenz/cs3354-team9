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
import DeleteAccount from './pages/DeleteAccount.vue'
import User from './pages/User.vue'
import SaveFavoriteRestaurant from './pages/SaveFavoriteRestaurant.vue'
import Map from './pages/Map.vue'
import Profile from './pages/Profile.vue'
import ReportIncorrectAllergy from './pages/ReportIncorrectAllergy.vue'

const { cookies } = useCookies()

async function fetchUser() {
  const sessionToken = cookies.get('session')
  if (!sessionToken) {
    return null
  }

  const headers = new Headers()
  headers.append("Content-Type", "application/json")
  headers.append("mycookies", `session=${sessionToken}`)

  const requestOptions = {
    method: "GET",
    headers: headers,
  }

  try {
    let response = await fetch("http://localhost:3000/api/whoami", requestOptions).then(response => response.json())
    return response?.user
  }
  catch (error) {
    console.error(error)
    return null
  }
}

const currentUser = ref(null)
fetchUser().then(user => currentUser.value = user)

const routes = {
  '': Home,
  'create-account': AccountCreation,
  'sign-in': SignIn,
  'remove-restaurant': RemoveRestaurant,
  'report-incorrect-allergy': ReportIncorrectAllergy,
  'filter-search': FilterSearch,
  'view-allergens': ViewAllergens,
  'delete-account': DeleteAccount,
  'save-favorite-restaurant': SaveFavoriteRestaurant,
  'map': Map,
  'profile': Profile,
  'rate-restaurant': RateRestaurant,
  'view-allergens': ViewAllergens,
  'user': User,
}

const currentPath = ref(window.location.hash)

const currentView = computed(() => {
  // get the first section of the path url, without slashes. i.e.
  // /this-part/not-this-part
  //  ^^^^^^^^^
  // this will support indexing by /page/:parameters
  const path = currentPath.value.match(/^\/?([^/]*)(?:\/|$)/i)[1];
  // return the matching page, else a 404 page
  return routes[path] || NotFound;
})

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
  fetchUser().then(user => currentUser.value = user)
})

const username = computed(() => currentUser.value?.username)
</script>

<template>
  <div>
    <header class="sticky top-0 left-0 right-0 p-2 border-b-2 border-slate-300 z-50 bg-white mb-6">
      <nav>
        <ul class="flex items-center gap-x-5 mx-6">
          <li>
            <a href="#/" class="flex items-center gap-x-3">
              <img class="size-18" src="./assets/Thresh circular logo.png">
              <img src="./assets/THRESH textual logo.png">
            </a>
          </li>
          <!-- If the user is not logged in, display sign up / sign in buttons -->
          <li v-if="!username" class="ml-auto flex items-center gap-x-5">
            <a href="#/create-account" class="px-2 py-2 rounded-md outline-green-950 outline-2 text-slate-50 bg-green-950">
              Sign Up
            </a>
            <a href="#/sign-in" class="px-2 py-2 rounded-md outline-green-950 outline-2 text-green-950">
              Sign In
            </a>
          </li>
          <!-- If the user is logged in, display username and profile button -->
          <li v-if="username" class="ml-auto">
            <a href="#/profile" class="flex items-center gap-x-2">
              <div class="text-lg font-semibold text-green-950">
                {{ username }}
              </div>
              <img class="size-16" src="./assets/profile.png">
            </a>
          </li>
        </ul>
      </nav>
    </header>
    <main class="w-full">
      <component :is="currentView" :currentUser="currentUser"/>
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>
