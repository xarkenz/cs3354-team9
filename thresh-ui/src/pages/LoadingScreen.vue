<template>
  <div
    v-if="isVisible"
    :class="[
      'fixed inset-0 z-50 bg-white overflow-hidden',
      { 'exit-wipe': isExiting }
    ]"
  >
    <div class="wipe-in w-full h-full absolute bg-green-950"></div>

    <div class="absolute inset-0 flex justify-center items-center">
      <div class="relative w-[400px] h-[400px] flex justify-center items-center">
        <img
          src="../assets/CurveText.svg"
          alt="Rotating Text"
          class="absolute w-45 h-45 animate-spin-slow"
        />
        <img
          src="../assets/ThreshCircleLogoWhite.svg"
          alt="Thresh Logo"
          class="absolute w-32 h-32 z-10"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isVisible = ref(true);
const isExiting = ref(false);

onMounted(() => {
  setTimeout(() => {
    isExiting.value = true;

    setTimeout(() => {
      isVisible.value = false;
    }, 1000);
  }, 4000);
});
</script>

<style scoped>
.wipe-in {
  animation: wipeIn 1s ease-out forwards;
}

@keyframes wipeIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0%);
  }
}

.exit-wipe {
  animation: wipeOut 1s ease-in forwards;
}

@keyframes wipeOut {
  from {
    transform: translateX(0%);
  }
  to {
    transform: translateX(100%);
  }
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 6s linear infinite;
}
</style>
