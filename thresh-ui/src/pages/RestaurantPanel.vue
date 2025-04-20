<script setup>
defineProps({ place: Object });
defineEmits(['close']);

const hashName = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash += name.charCodeAt(i);
  }
  return hash;
};

const getImageForRestaurant = (name) => {
  const index = hashName(name) % defaultImages.length;
  return defaultImages[index];
};

</script>

<template>
  <div class="w-[400px] h-full bg-white p-4 border-r shadow-xl overflow-y-auto relative">
    <!-- CLOSE BUTTON -->
    <button
      @click="$emit('close')"
      class="absolute top-3 right-3 text-gray-500 hover:text-black text-4xl font-bold"
      aria-label="Close Panel"
    >
      &times;
    </button>

    

    <!-- Restaurant Image -->
    <img
    :src="getImageForRestaurant(place.name)"
    alt="Restaurant Image"
    class="w-full h-auto object-cover rounded pt-10 my-4"
    />

    

    <!-- Restaurant Info -->
     <div class="px-4">
        <h2 class="text-2xl font-bold mt-8 text-green-950">{{ place.name }}</h2>
        <p v-if="place.priceRange" class="text-sm mt-1 text-gray-600">{{ place.priceRange }}</p>


        <router-link
        :to="`/viewallergens/${place.id}`"
        class="text-blue-600 block mt-3 underline"
        >
        View Allergen List
        </router-link>

        <router-link
        :to="`/raterestaurant/${place.id}`"
        class="bg-green-500 text-white px-3 py-2 mt-4 rounded inline-block"
        >
        Rate This Restaurant
        </router-link>
     </div>
    
  </div>
</template>
