<!-- Made by Isaac Philo. This is a simple user profile. -->

<template>
  <div class="min-h-screen bg-[#606C38] py-12 px-4 flex justify-center items-center">
    <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
      
      <!-- Left Section -->
      <div class="flex flex-col gap-5 justify-center">
        <!-- Profile + Welcome Message -->
        <div class="flex items-center gap-4">
          <img class="w-24 h-24 rounded-full object-cover" src="../assets/profile.png" alt="Profile" />
          <div>
            <h2 class="text-[#283618] text-lg">Welcome,</h2>
            <p class="text-[#283618] text-2xl font-bold">
              {{ currentUser?.username || 'User' }}
            </p>
          </div>
        </div>

        <!-- Inputs and Edit Button -->
        <div class="w-full space-y-4">
          <label class="block text-[#283618] text-sm font-bold">Username</label>
          <input
            type="text"
            placeholder="User"
            class="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none"
            :value="currentUser?.username"
            disabled
          />

          <label class="block text-[#283618] text-sm font-bold">Email</label>
          <input
            type="text"
            placeholder="YourEmail"
            class="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none"
            :value="currentUser?.email || 'N/A'"
            disabled
          />

          <button class="w-full bg-[#DDA15E] hover:bg-[#BC6C25] text-white py-2 rounded-md transition">
            Edit
          </button>
        </div>
      </div> <!-- LEFT SECTION END -->

      <!-- Right Section -->
      <div class="flex flex-col justify-center gap-4">
        <!-- Dietary Profiles -->
        <div class="flex items-center justify-between bg-[#C5C9B6] p-4 rounded-md shadow-md">
          <div class="flex items-center gap-4">
            <NoSymbolIcon class="w-8 h-8" />
            <div>
              <p class="font-semibold text-green-950">Dietary Profiles</p>
              <p class="text-sm text-green-950"># Profiles Saved</p>
            </div>
          </div>
        </div>

        <!-- My Reviews -->
        <div
          @click="showReviewModal = true"
          class="flex items-center justify-between bg-[#C5C9B6] p-4 rounded-md shadow-md cursor-pointer hover:brightness-95 transition"
        >
          <div class="flex items-center gap-4">
            <PencilSquareIcon class="w-8 h-8 text-green-950" />
            <div>
              <p class="font-semibold text-green-950">My Reviews</p>
              <p class="text-sm text-green-950"># Reviews Posted</p>
            </div>
          </div>
        </div>

        <!-- My Favorites -->
        <div class="flex items-center justify-between bg-[#C5C9B6] p-4 rounded-md shadow-md">
          <div class="flex items-center gap-4">
            <HandThumbUpIcon class="w-8 h-8 text-green-950" />
            <div>
              <p class="font-semibold text-green-950">My Favorites</p>
              <p class="text-sm text-green-950"># Favorite Restaurants</p>
            </div>
          </div>
        </div>

        <!-- Settings -->
        <div
          @click="goToAccountSettings"
          class="cursor-pointer flex items-center justify-between bg-[#C5C9B6] p-4 rounded-md shadow-md hover:brightness-95 transition"
        >
          <div class="flex items-center gap-4">
            <Cog6ToothIcon class="w-8 h-8 text-green-950" />
            <div>
              <p class="font-semibold text-green-950">Account Settings</p>
            </div>
          </div>
        </div>

        <!-- Remove Restaurants (Demo) -->
        <a
          href="#/remove-restaurant"
          class="flex items-center justify-between bg-[#C5C9B6] p-4 rounded-md shadow-md hover:brightness-95 transition"
        >
          <div class="flex items-center gap-4">
            <TrashIcon class="w-8 h-8 text-green-950" />
            <div>
              <p class="font-semibold text-green-950">Remove Restaurants</p>
              <p class="text-sm text-green-950">Demo</p>
            </div>
          </div>
          <ChevronRightIcon class="w-6 h-6 text-green-950" />
        </a>

        <!-- Log Out Button -->
        <button
          @click="signOut"
          class="mt-6 w-full py-2 rounded-md bg-white border border-[#4B231B] text-[#914F3B] font-bold hover:bg-[#914F3B] hover:text-white transition"
        >
          Log Out
        </button>
      </div>
    </div>

    <!-- Review Modal -->
    <div
      v-if="showReviewModal"
      class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 relative">
        <!-- Close button -->
        <button
          @click="showReviewModal = false"
          class="absolute top-3 right-3 text-gray-600 hover:text-black text-3xl"
        >
          &times;
        </button>

        <!-- Modal Header -->
        <div class="flex items-center gap-3 mb-6">
          <img src="../assets/profile.png" class="w-10 h-10 rounded-full" alt="User" />
          <h2 class="text-xl font-semibold text-[#283618]">
            {{ currentUser?.username || 'User' }}’s Reviews
          </h2>
        </div>

        <!-- Review List -->
        <div v-if="userReviews.length" class="space-y-4">
          <div
            v-for="review in userReviews"
            :key="review.id"
            class="bg-[#DDE2E4] rounded-md p-4 shadow-sm"
          >
            <h3 class="text-lg font-bold text-[#283618]">
              {{ review.business?.name }}
            </h3>
            <div class="flex items-center text-sm text-gray-500 mb-1">
              <span v-for="n in review.numStars" :key="n" class="text-yellow-500">★</span>
              <span v-for="n in (5 - review.numStars)" :key="'empty' + n" class="text-gray-300">★</span>
            </div>
            <p class="text-gray-800">{{ review.content }}</p>
          </div>
        </div>
        <div v-else class="text-center text-gray-500">No reviews yet.</div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Cog6ToothIcon,
  PencilSquareIcon,
  NoSymbolIcon,
  HandThumbUpIcon,
  TrashIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline';
import RemoveRestaurant from './RemoveRestaurant.vue';

export default {
  name: 'Profile',
  props: ['currentUser'],
  components: {
    Cog6ToothIcon,
    PencilSquareIcon,
    NoSymbolIcon,
    HandThumbUpIcon,
    TrashIcon,
    ChevronRightIcon,
    RemoveRestaurant
  },
  data() {
    return {
      userReviews: [],
      showReviewModal: false,
    };
  },
  mounted() {
    this.fetchUserReviews();
  },
  methods: {
    async fetchUserReviews() {
      try {
        if (!this.currentUser?.username) return;
        
        const response = await fetch(`/api/user/${this.currentUser.username}`, {
          headers: {
            'Content-Type': 'application/json',
            'mycookies': document.cookie,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch user reviews');
        const data = await response.json();
        this.userReviews = data.reviews.map(r => ({ ...r, business: r.business }));
      } catch (error) {
        console.error('Error loading user reviews:', error.message);
      }
    },
    goToAccountSettings() {
      window.location.hash = '/account-settings';
    },
    signOut() {
      this.$cookies.remove('session');
      window.location.hash = '/';
    }
  }
};
</script>
