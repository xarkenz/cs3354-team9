<template>
  <div>
    <!-- Loading screen -->
    <LoadingScreen />

    <!-- Homepage fades in after loading finishes -->
    <div
      v-if="showHome"
      class="fade-in transition-opacity opacity-0 text-center z-[-2] h-screen w-screen"
    >
      <!-- <div class="text-xl py-30 block mb-5 underline">Thresh Homepage!</div> -->

      <div class="flex-row items-center justify-between w-full h-screen grid grid-cols-2 custom-color">
      <!-- Hero Text -->
      <div class="">
        <div class="grad">
          <h1 class="text-8xl font-extrabold text-white mb-4">THRESH</h1>
          <h4 class="text-3xl font-medium text-white mb-6">Find Food That Fits Your Needs</h4>
        </div>
        
        <div class="justify-center-safe">
          <a class="px-4 py-2 mb-4 item-center inline-block text-white bg-lime-950 rounded-full hover:bg-green-100 hover:text-green-950 transition text-xl"
          href="#/create-account">
          Get Started
          </a>
          <div class="gap-2">
            <p class="text-slate-300 font-semibold">Already have an account?</p>
            <a class="font-semibold text-orange-300" href="#/sign-in">
              Sign In to Thresh.
            </a>
        </div>
        
        </div>
      </div>

      <!-- Spline iframe
      <div class="flex-1 h-[400px]">
        <iframe
          src="https://my.spline.design/bowlspooncopy-jlAMfmMhVgnUlXTKuQ3D7CIr/"
          frameborder="0"
          class="w-full h-full rounded-xl shadow-lg"
          allowfullscreen
        ></iframe>
      </div> -->

      <div class="basis-1/2 flex justify-center">
        <img src="../assets/restaurant3d.png" class="max-w-full max-h-full"/>
      </div>

      <div class="text-slate-800 m-5">
        <p>View the pages we have created: (OLD PAGES)</p>
        <ul>
          <!-- <li><a href="#/">Homepage</a></li> -->
          <!-- MOVED TO VIEW ALLERGEN PAGE -->
          <!-- <li><a href="#/report-incorrect-allergy">Report Incorrect Allergy</a></li> -->
          <li><a href="#/filter-search">Filter search</a></li>
          <li><a href="#/view-allergens">View allergens</a></li>

          <!-- MOVED TO PROFILE PAGE -->
          <!-- <li><a href="#/delete-account">Delete account</a></li> -->
          <!-- <li><a href="#/remove-restaurant">Remove a restaurant</a></li> -->
          <!-- <li><a href="#/ban-user">Ban User</a></li>
          <li><a href="#/save-favorite-restaurant">Save Favorite Restaurant</a></li> -->
          <!-- <li><a href="#/profile">Profile</a></li> -->
          <li><a href="#/map">Map</a></li>

        </ul>
      </div>

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

.custom-color {
  background: #606C38;
}

.grad {
  background: #f1f0e9;
background: linear-gradient(to right, #f0ead5 0%, #e7bb8c 50%, #eee1a7 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;

}

</style>