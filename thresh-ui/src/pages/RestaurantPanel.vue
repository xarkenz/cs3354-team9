<script setup>
import { ref, watch } from 'vue';
// import { PencilSquare } from '@heroicons/vue/20/solid'

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

// Star Rating function (computes the average of all the reviews)
function getAverageStars(reviews) {
  if (!reviews || reviews.length === 0) return 0;
  const total = reviews.reduce((sum, r) => sum + r.numStars, 0);
  return total / reviews.length;
}
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

    <img
      v-if="place.imageUrl"
      :src="place.imageUrl"
      alt="Restaurant Image"
      class="w-full h-48 object-cover rounded mb-2 mt-10"
    />

    <!-- Restaurant Info -->
    <div class="px-4">
      <h2 class="text-2xl font-bold mt-2 text-green-950">{{ place.name }}</h2>

      <div class="flex items-center mb-2">
        <!-- Star Rating -->
        <div class="flex items-center">
          <span v-for="i in 5" :key="i">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              :class="{
                'text-yellow-400': i <= Math.round(getAverageStars(reviews)),
                'text-gray-300': i > Math.round(getAverageStars(reviews))
              }"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.948a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.287 3.948c.3.921-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.176 0l-3.36 2.44c-.784.57-1.838-.197-1.539-1.118l1.287-3.948a1 1 0 00-.364-1.118L2.075 9.375c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.948z" />
            </svg>
          </span>
        </div>

        <!-- Price Range -->
        <p class="text-sm text-brown-950 font-semibold ml-2">
          {{ place.priceRange || 'Not listed' }}
        </p>
      </div>

      <div class="flex grid-rows-2  gap-4">
        <a
        :href="`/view-allergens/${place.id}`"
        class="bg-amber-700 text-white px-3 py-2 mt-4 rounded"
      >
        View Allergen List
      </a>

      <a
        :href="`#/rate-restaurant/${place.id}`"
        class="bg-lime-600 text-green-950 px-3 py-2 mt-4 rounded"
      >
        Rate This Restaurant
        </a>
      </div>

      <!-- Reviews Section -->
      <div class="mt-6">
        <h3 class="text-xl font-semibold text-green-900 mb-4">
          {{ reviews.length }} Review{{ reviews.length !== 1 ? 's' : '' }}
        </h3>

        <div v-if="reviews.length > 0" class="space-y-4">
          <div
            v-for="review in reviews"
            :key="review.id"
            class="bg-white border rounded-lg p-4 shadow-sm"
          >
            <div class="flex items-center gap-2 mb-1">
              <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <svg
                  class="w-5 h-5 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M10 10a4 4 0 100-8 4 4 0 000 8zm0 2c-4 0-6 2-6 4v1h12v-1c0-2-2-4-6-4z"
                  />
                </svg>
              </div>
              <p class="font-semibold text-green-900">
                {{ review.author?.username || 'Anonymous' }}
              </p>
            </div>

            <div class="flex items-center gap-1 mb-1">
              <span v-for="i in 5" :key="i">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  :class="{
                    'text-yellow-400': i <= review.numStars,
                    'text-gray-300': i > review.numStars
                  }"
                >
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.948a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.287 3.948c.3.921-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.176 0l-3.36 2.44c-.784.57-1.838-.197-1.539-1.118l1.287-3.948a1 1 0 00-.364-1.118L2.075 9.375c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.948z"
                  />
                </svg>
              </span>
            </div>

            <p class="text-gray-800">{{ review.content }}</p>
          </div>
        </div>

        <div v-else class="text-gray-500 italic">No reviews yet. Be the first to leave one!</div>
      </div>
    </div>
  </div>
</template>
