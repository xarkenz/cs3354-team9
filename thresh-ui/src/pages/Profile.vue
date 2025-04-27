<!-- Made by Isaac Philo. This is a simple user profile. -->

<template>
  <div class="p-10 flex flex-col justify-center items-center gap-5">
    <div class="text-xl">
      Welcome, <b>{{ currentUser?.username || 'anonymous user' }}</b>!
    </div>
    <img class="size-40" src="../assets/profile.png">
    <a
      href="#/save-favorite-restaurant"
      class="px-4 py-2 rounded-full bg-lime-700 text-white hover:bg-lime-800 transition"
    >
      🤍 Favorite Restaurants
    </a>
    <a
      href="#/delete-account"
      class="px-4 py-2 rounded-full bg-lime-700 text-white hover:bg-lime-800 transition"
    >
      ⚙️ Account Settings
    </a>
    <button
      @click="signOut"
      class="px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
    >
      Sign Out
    </button>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  props: ['currentUser'],
  methods: {
    signOut() {
      this.$cookies.remove('session')
      window.location.hash = '/'
    }
  },
}
</script>
