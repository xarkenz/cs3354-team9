<script setup>
import { ref, watch } from 'vue';
import { DocumentTextIcon, PencilSquareIcon } from '@heroicons/vue/24/solid';
import RateRestaurant from './RateRestaurant.vue';
import defaultImage from '../assets/default.jpg'; // Default Image
import dairyIcon from '../assets/icons/Dairy-Icon.svg';
import eggIcon from '../assets/icons/Egg-Icon.svg';
import fishIcon from '../assets/icons/Fish-Icon.svg';
import glutenFreeIcon from '../assets/icons/Gluten-free-Icon.svg';
import halalIcon from '../assets/icons/Halal-Icon.svg';
import kosherIcon from '../assets/icons/Kosher-Icon.svg';
import lactoseFreeIcon from '../assets/icons/Lactose-free-Icon.svg';
import nutIcon from '../assets/icons/Nut-Icon.svg';
import pescatarianIcon from '../assets/icons/Pescatarian-Icon.svg';
import sesameIcon from '../assets/icons/Sesame-Icon.svg';
import shellfishIcon from '../assets/icons/Shellfish-Icon.svg';
import soyIcon from '../assets/icons/Soy-Icon.svg';
import veganIcon from '../assets/icons/Vegan-Icon.svg';
import vegetarianIcon from '../assets/icons/Vegetarian-Icon.svg';
import wheatIcon from '../assets/icons/Wheat-Icon.svg';

import { HeartIcon as HeartOutlineIcon } from '@heroicons/vue/24/outline';


const props = defineProps({
  place: {
    type: Object,
    required: true
  }
});
const emit = defineEmits(['close']);
const showRatingModal = ref(false);

const reviews = ref([]);
const imageSrc = ref(props.place.imageUrl || defaultImage);

const iconMap = {
  Vegan: veganIcon,
  Vegetarian: vegetarianIcon,
  Halal: halalIcon,
  Kosher: kosherIcon,
  'Gluten-free': glutenFreeIcon,
  Dairy: dairyIcon,
  Egg: eggIcon,
  Fish: fishIcon,
  'Lactose-free': lactoseFreeIcon,
  Nut: nutIcon,
  Pescatarian: pescatarianIcon,
  Sesame: sesameIcon,
  Shellfish: shellfishIcon,
  Soy: soyIcon,
  Wheat: wheatIcon,
};

const iconColorMap = {
  Vegan: 'text-amber-800',
  Vegetarian: 'text-lime-700',
  Halal: 'text-green-950',
  Kosher: 'text-amber-700',
  'Gluten-free': 'text-yellow-600',
  Dairy: 'text-slate-500',
  Egg: 'text-amber-800',
  Fish: 'text-lime-700',
  'Lactose-free': 'text-red-950',
  Nut: 'text-amber-700',
  Pescatarian: 'text-yellow-600',
  Sesame: 'text-green-950',
  Shellfish: 'text-slate-500',
  Soy: 'text-red-950',
  Wheat: 'text-brown-700'
};


// Watch for changes to the place and its image
watch(() => props.place, (newPlace) => {
  imageSrc.value = newPlace?.imageUrl || defaultImage;

  if (newPlace && newPlace.id) {
    fetchReviews(newPlace.id);
  } else {
    reviews.value = [];
  }
});

async function fetchReviews(restaurantId) {
  try {
    const res = await fetch(`http://localhost:3000/api/reviews?restaurantId=${restaurantId}`);
    const result = await res.json();
    console.log('Fetched reviews:', result); // Helps debug
    reviews.value = result.reviews || result.data || []; // covers both
  } catch (err) {
    console.error('Failed to load reviews:', err);
    reviews.value = [];
  }
}

function handleImageError() {
  imageSrc.value = defaultImage;
}

// Re-fetches updated reviews
function handleReviewSubmitted() {
  fetchReviews(props.place.id); 
}

function getAverageStars(reviews) {
  if (!reviews || reviews.length === 0) return 0;
  const total = reviews.reduce((sum, r) => sum + r.numStars, 0);
  return total / reviews.length;
}

function saveToFavorites(event){
  document.getElementById("HeartIcon").innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"red\" class=\"size-6\"><path d=\"m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z\" /></svg>";
  
  const favoriteRestaurant = {
  name: props.place.name,
  rating: props.place.rating
  };

  let favorites = [];
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('favorites='));
  
  if (cookieValue) {
    favorites = JSON.parse(decodeURIComponent(cookieValue.split('=')[1]));
  }

  if (!favorites.some(fav => fav.name === favoriteRestaurant.name)) {
    favorites.push(favoriteRestaurant);
  }

  document.cookie = `favorites=${encodeURIComponent(JSON.stringify(favorites))}; path=/; max-age=31536000`;
  console.log('Saved favorites:', favorites);
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

    <div class="relative w-full h-48 mt-10 mb-2">
  <img
    :src="imageSrc"
    @error="handleImageError"
    alt="Restaurant Image"
    class="w-full h-full object-cover rounded"
  />
  <button
    class="absolute top-2 right-2 bg-white bg-opacity-80 p-2 rounded-full shadow hover:bg-opacity-100 transition"
    aria-label="Save to favorites" @click="saveToFavorites" id = "HeartIcon"
  >
    <HeartOutlineIcon class="w-6 h-6 text-green-900" />
  </button>
</div>


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

      <!-- Icon Tag (based on place.icon) -->
      <div class="mt-3" v-if="place.icon && iconMap[place.icon]">
        <div class="inline-flex items-center gap-2 border border-gray-300 rounded-full px-3 py-1 bg-gray-50 shadow-sm w-fit">
          <img
            :src="iconMap[place.icon]"
            alt="Dietary Icon"
            class="w-6 h-6"
          />
          <span class="text-sm font-medium"
            :class="iconColorMap[place.icon]"
          >
            {{ place.icon }}
          </span>
        </div>
      </div>

      
      <div class="flex flex-col gap-4 mt-4">
        <!-- View Allergen List Button -->
        <a
          :href="`/view-allergens/${place.id}`"
          class="bg-amber-800 text-white px-3 py-2 rounded flex items-center gap-2"
        >
          <DocumentTextIcon class="w-5 h-5 text-white" />
          View Allergen List
        </a>

        <!-- Rate This Restaurant Button -->
        <button
          @click="showRatingModal = true"
          class="bg-lime-700 text-white px-3 py-2 rounded flex items-center gap-2 hover:bg-green-950"
        >
          <PencilSquareIcon class="w-5 h-5 text-white" />
          Rate This Restaurant
        </button>
      </div>

      <!-- Modal for rating -->
      <RateRestaurant
        v-if="showRatingModal"
        :place="place"
        @close="showRatingModal = false"
        @submitted="handleReviewSubmitted"
      />

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
              <a v-if="review.author" class="font-semibold text-green-900" :href="'#/user/' + review.author.username">
                {{review.author.username}}
              </a>
              <p v-else class="font-semibold text-green-900">
                Anonymous
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
