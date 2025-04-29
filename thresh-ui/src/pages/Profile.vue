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
      <p class="text-[#283618] text-2xl font-bold">{{ currentUser?.username || 'User' }}</p>
    </div>
  </div>

  <!-- Inputs and Edit Button -->
  <div class="w-full space-y-4">
    <label class="block text-[#283618] text-sm font-bold">Username</label>
    <input
      type="text"
      placeholder="YourUsername"
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
</div>


      <!-- Right Section -->
      <div class="flex flex-col justify-center gap-4">
        <!-- Dietary Profiles -->
        <div class="flex items-center justify-between bg-[#C5C9B6] p-4 rounded-md shadow-md">
          <div class="flex items-center gap-4">
            <NoSymbolIcon class="w-8 h-8" />
            <div>
              <p class="font-semibold">Dietary Profiles</p>
              <p class="text-sm text-gray-700"># Profiles Saved</p>
            </div>
          </div>
        </div>

        <!-- My Reviews -->
        <div class="flex items-center justify-between bg-[#C5C9B6] p-4 rounded-md shadow-md">
          <div class="flex items-center gap-4">
            <PencilSquareIcon class="w-8 h-8 text-green-950"/>
            <div>
              <p class="font-semibold">My Reviews</p>
              <p class="text-sm text-gray-700"># Reviews Posted</p>
            </div>
          </div>
        </div>

        <!-- My Favorites -->
        <div class="flex items-center justify-between bg-[#C5C9B6] p-4 rounded-md shadow-md">
          <div class="flex items-center gap-4">
            <HandThumbUpIcon class="w-8 h-8 text-green-950"/>
            <div>
              <p class="font-semibold">My Favorites</p>
              <p class="text-sm text-gray-700"># Favorite Restaurants</p>
            </div>
          </div>
        </div>

        <!-- Settings -->
        <div class="flex items-center justify-between bg-[#C5C9B6] p-4 rounded-md shadow-md">
          <div class="flex items-center gap-4">
            <div>
              <Cog6ToothIcon class="w-8 h-8 text-green-950"/>
            </div>
            <div>
              <p class="font-semibold text-green-950">Settings</p>
            </div>
          </div>
        </div>

        <!-- Log Out Button -->
        <button
          @click="signOut"
          class="mt-6 w-full py-2 rounded-md bg-white border border-[#4B231B] text-[#914F3B] font-bold hover:bg-[#914F3B] hover:text-white transition"
        >
          Log Out
        </button>
      </div>
    </div>
  </div>
</template>



<script>
import { Cog6ToothIcon, PencilSquareIcon, NoSymbolIcon, HandThumbUpIcon} from '@heroicons/vue/24/outline';

export default {
  name: 'Profile',
  props: ['currentUser'],
  components: {
    Cog6ToothIcon, PencilSquareIcon, NoSymbolIcon, HandThumbUpIcon
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
