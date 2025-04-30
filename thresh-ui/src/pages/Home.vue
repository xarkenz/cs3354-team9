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

      <!-- HERO SECTION -->
      <div class="relative w-screen h-screen overflow-hidden bg-[#606C38]">

        <!-- Overlay content -->
        <div class="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <div class="patterns">        
            <svg viewBox="0 0 1000 120" preserveAspectRatio="xMidYMid meet">
              <text x="50%" y="65" text-anchor="middle" dominant-baseline="middle">THRESH</text>
            </svg>
          </div>

          <h4 class="text-4xl font-large mb-8 font-bold text-[#FEFAE0]">
            Find The Right Bite, Every Time
          </h4>


          <a href="#/create-account"
            class="px-6 py-3 mb-4 text-white bg-lime-950 rounded-full hover:bg-green-100 hover:text-green-950 transition text-xl">
            Get Started
          </a>

          <!-- <div class="text-slate-300 text-left my-5 mx-auto">
            <p class="font-semibold">Demo use cases:</p>
            <ul>
              <li><a href="#/report-incorrect-allergy">Report Incorrect Allergy</a></li>
              <li><a href="#/filter-search">Filter search</a></li>
              <li><a href="#/view-allergens">View allergens</a></li>
              <li><a href="#/user/example-user">Ban User (must be logged in as administrator)</a></li>
              <li><a href="#/map">Map</a></li>
              <li><a href="#/manage-restaurants">Manage Restaurants</a></li>
              <li><a href="#/manage-allergens">Manage Allergens</a></li>
            </ul>
          </div> -->
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
@import url('https://fonts.googleapis.com/css2?family=Amarante&family=Meow+Script&display=swap');

.patterns {
  width: 100%;
  height: auto;
  margin: 0;
  padding: 0;
}

svg {
  width: 100%;
  height: auto;
  display: block;
}

svg text {
  font-family: 'Amarante', cursive;
  letter-spacing: 10px;
  stroke: #FEFAE0;
  font-size: 120px;
  font-weight: 500;
  stroke-width: 3;
  fill: transparent;
  stroke-dasharray: 50% 0;
  stroke-dashoffset: 0;
  animation: textAnimate 5s infinite alternate;
}

@keyframes textAnimate {
  0% {
    stroke-dasharray: 0 50%;
    stroke-dashoffset: 20%;
    fill: hsl(88, 38%, 15%)
  }

  100% {
    stroke-dasharray: 50% 0;
    stroke-dashoffset: -20%;
    fill: hsla(189, 68%, 75%, 0%);
  }
}

.meow-script-regular {
  font-family: "Meow Script", cursive;
}


.fade-in {
  opacity: 1 !important;
}

.custom-color {
  background: #606C38;
}

/* .grad {
  background: #f1f0e9;
  background: linear-gradient(to right, #faf7ed 0%, #e5c4a0 50%, #e6d691 100%);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% auto;
  background-position: center;
} */


.animate-character {
  background-image: linear-gradient(
    -225deg,
    #ffffff 0%,
    #f4f2e6 29%,
    #edc290 67%,
    #e8b487 100%
  );
  background-size: 200% auto;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: textclip 5s linear infinite;
  display: inline-block;
}

@keyframes textclip {
  to {
    background-position: 200% center;
  }
}

ul li::before {
  content: "➤";
  margin-inline: 1rem;
}

</style>
