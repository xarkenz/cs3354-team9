<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  place: {
    type: Object,
    required: true
  }
});
const emit = defineEmits(['close']);

const reviews = ref([]);

// When the selected place changes, fetch reviews
watch(() => props.place, async (newPlace) => {
  if (newPlace && newPlace.id) {
    try {
      const res = await fetch(`http://localhost:3000/api/reviews?restaurantId=${newPlace.id}`);
      const result = await res.json();
      reviews.value = result.data || []; // fallback to empty array
    } catch (err) {
      console.error('Failed to load reviews:', err);
      reviews.value = [];
    }
  } else {
    reviews.value = [];
  }
});

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
    <!-- <img
    :src="getImageForRestaurant(place.name)"
    alt="Restaurant Image"
    class="w-full h-auto object-cover rounded pt-10 my-4"
    /> -->

    

    <!-- Restaurant Info -->
     <div class="px-4">
        <h2 class="text-2xl font-bold mt-8 text-green-950">{{ place.name }}</h2>
        <p v-if="place.priceRange" class="text-sm mt-1 text-gray-600">{{ place.priceRange }}</p>


        <a
          :href="`/view-allergens/${place.id}`"
          class="text-blue-600 block mt-3 underline"
          >
          View Allergen List
        </a>

        <a
          :href="`#/rate-restaurant/${place.id}`"
          class="bg-green-500 text-white px-3 py-2 mt-4 rounded inline-block"
        >
          Rate This Restaurant
        </a>
        <div class="mt-6">
          <h3 class="text-xl font-semibold">Reviews</h3>

          <div v-if="reviews.length > 0">
            <div v-for="review in reviews" :key="review.id" class="mb-4">
              <p class="font-bold text-green-900">{{ review.title }}</p>
              <p class="text-yellow-500">{{ review.numStars }} ★</p>
              <p>{{ review.content }}</p>
              <p class="text-sm text-gray-500">— User {{ review.authorID }}</p>
            </div>
          </div>

          <div v-else class="text-gray-500 italic">No reviews yet. Be the first to leave one!</div>
        </div>


        
     </div>
    
  </div>
</template>
