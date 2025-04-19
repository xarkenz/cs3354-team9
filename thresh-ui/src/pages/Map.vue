<!--
Created by Sarah Jacob for UC12: Scroll and Zoom Map View
-->


<script setup>
import { ref, onMounted } from 'vue';
import { GoogleMap, Marker } from 'vue3-google-map';
import RateRestaurant from './RateRestaurant.vue';

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const center = ref({ lat: 32.9599, lng: -96.7718 }); // Richardson
const places = ref([]);
const selectedPlace = ref(null);

async function fetchRestaurants() {
  try {
    console.log("...saving")
    const response = await fetch(
      `http://localhost:3001/api/save-restaurants`
    );
    const data = await response.json();
    places.value = data.saved; // use saved businesses from DB
  } catch (error) {
    console.error("Failed to fetch/save places:", error);
  }
}


onMounted(() => {
  fetchRestaurants();
});
</script>

<template>
  <div class="w-screen h-screen flex flex-col">
    <GoogleMap
      :api-key="apiKey"
      :center="center"
      :zoom="12"
      style="width: 100%; height: 100%;"
    >
      <Marker
        v-for="place in places"
        :key="place.place_id"
        :options="{
          position: {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng
          },
          title: place.name
        }"
        @click="selectedPlace = place"
      />
    </GoogleMap>
  </div>
</template>
