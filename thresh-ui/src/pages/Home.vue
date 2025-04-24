<template>
  <div>
    <!-- Loading screen -->
    <LoadingScreen />

    <!-- Homepage fades in after loading finishes -->
    <div
      v-if="showHome"
      class="fade-in transition-opacity opacity-0 text-center z-[-2] h-screen w-screen"
    >
      <div class="gradient w-fit mx-auto">
        <h1 class="text-5xl font-extrabold text-center pt-14">THRESH</h1>
        <h4 class="text-xl font-medium">Find Food That Fits Your Needs</h4>
      </div>
      <a
        href="#/create-account"
        class="px-3 py-2 my-2 w-fit mx-auto block text-white bg-lime-800 rounded-4xl hover:bg-green-100 hover:text-green-950"
      >
        Get Started
      </a>

      <div class="gap-2">
        <p class="text-slate-500 font-semibold">Already have an account?</p>
        <a class="font-semibold text-lime-500 hover:bg-white hover:text-amber-500" href="#/sign-in">Sign In to Thresh.</a>
      </div>

      <div class="text-slate-300 m-5">
        <p>View the pages we have created: (OLD PAGES)</p>
        <ul>
          <li><a href="#/">Homepage</a></li>
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
import LoadingScreen from './LoadingScreen.vue';

const showHome = ref(false);

onMounted(() => {
  // Delays the total animation time in LoadingScreen.vue
  setTimeout(() => {
    showHome.value = true;
  }, 1000);
});
</script>

<style scoped>
.fade-in {
  opacity: 1 !important;
}

.gradient {
  background: #3A592B;
  background: linear-gradient(to right, #182d0e 0%, #778237 53%, #c59335 100%);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

</style>
