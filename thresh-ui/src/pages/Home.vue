<template>
  <div>
    <!-- Loading screen -->
    <LoadingScreen />

    <!-- Homepage fades in after loading finishes -->
    <div
      v-if="showHome"
      class="fade-in transition-opacity duration-1000 opacity-0 text-center"
    >
      <div class="text-xl py-30 block mb-5 underline">Thresh Homepage!</div>
      <div>
        <p>View the pages we have created:</p>
        <ul>
          <li><a href="#/">Homepage</a></li>
          <li><a href="#/create-account">Sign up</a></li>
          <li><a href="#/sign-in">Sign in</a></li>
          <li><a href="#/remove-restaurant">Remove a restaurant</a></li>
          <li><a href="#/report-incorrect-allergy">Report Incorrect Allergy</a></li>
          <li><a href="#/filter-search">Filter search</a></li>
          <li><a href="#/view-allergens">View allergens</a></li>
          <li><a href="#/delete-account">Delete account</a></li>
          <li><a href="#/ban-user">Ban User</a></li>
          <li><a href="#/save-favorite-restaurant">Save Favorite Restaurant</a></li>
          <li><a href="#/map">Map</a></li>
          <li><a href="#/profile">Profile</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import LoadingScreen from './LoadingScreen.vue'; // Adjust path if needed

const showHome = ref(false);

onMounted(() => {
  // Delay matches the total animation time in LoadingScreen.vue
  setTimeout(() => {
    showHome.value = true;
  }, 5000);
});
</script>

<style scoped>
.fade-in {
  opacity: 1 !important;
}
</style>
