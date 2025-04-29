<!-- Made by Isaac Philo. This is a simple user profile. -->

<template>
  <div class="p-10 flex flex-col justify-center items-center gap-5">
    <div class="text-xl">
      Welcome, <b>{{ currentUser?.username || 'anonymous user' }}</b>!
    </div>

    <img class="size-40" src="../assets/profile.png">

    <!-- Favorite Restaurants Button -->
    <a
      href="#/save-favorite-restaurant"
      class="flex items-center gap-2 px-4 py-2 rounded-full bg-lime-700 text-white hover:bg-lime-800 transition"
    >
    <div class="w-6 h-6">
      <HeartOutlineIcon class="text-white" />
    </div>
    <p>Favorite Restaurants</p>
    </a>

    <!-- Account Settings Button -->
    <a
      href="#/account-settings"
      class="flex items-center gap-2 px-4 py-2 rounded-full bg-lime-700 text-white hover:bg-lime-800 transition"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 8c-1.105 0-2 .895-2 2v6c0 1.105.895 2 2 2s2-.895 2-2v-6c0-1.105-.895-2-2-2zm0-6a6 6 0 100 12 6 6 0 000-12z" />
      </svg>
      Account Settings
    </a>

    <!-- Sign Out Button -->
    <button
      @click="signOut"
      class="px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
    >
      Sign Out
    </button>

    <!-- Display Reviews -->
    <div v-if="userReviews.length" class="mt-10 w-full max-w-2xl">
      <h2 class="text-2xl font-bold mb-4 text-center">Your Reviews</h2>
      <div v-for="review in userReviews" :key="review.id" class="bg-white shadow-md rounded-lg p-4 mb-4">
        <h3 class="text-lg font-semibold mb-1">{{ review.title }}</h3>
        <div class="flex items-center mb-2">
          <template v-if="Number.isInteger(review.numStars)">
            <span v-for="n in review.numStars" :key="n" class="text-yellow-400">★</span>
            <span v-for="n in (5 - review.numStars)" :key="'empty' + n" class="text-gray-300">★</span>
          </template>
          <template v-else>
            <span class="text-gray-400">No rating</span>
          </template>
        </div>
        <p class="text-gray-700">{{ review.content }}</p>
        <p class="text-sm text-gray-500 mt-2">Restaurant: <b>{{ review.business?.name }}</b></p>
      </div>
    </div>

  </div>
</template>

<script>
import { HeartIcon as HeartOutlineIcon } from '@heroicons/vue/24/outline';

export default {
  name: 'Profile',
  props: ['currentUser'],
  components: {
    HeartOutlineIcon,
  },
  data() {
    return {
      userReviews: [],
    };
  },
  mounted() {
    this.fetchUserReviews();
  },
  methods: {
    async fetchUserReviews() {
      try {
        if (!this.currentUser?.username) return;
        
        const response = await fetch(`http://localhost:3000/api/user/${this.currentUser.username}`, {
          headers: {
            'Content-Type': 'application/json',
            'mycookies': document.cookie, // Include session token manually
          },
        });

        if (!response.ok) throw new Error('Failed to fetch user reviews');

        const data = await response.json();
        this.userReviews = data.reviews.map(r => ({
          ...r,
          business: r.business,
        }));
      } catch (error) {
        console.error('Error loading user reviews:', error.message);
      }
    },
    signOut() {
      this.$cookies.remove('session');
      window.location.hash = '/';
    }
  }
};
</script>
