<!--
Created by Sarah Jacob for UC12: Scroll and Zoom Map View
-->
<script setup>
import { ref, onMounted } from 'vue';
import { GoogleMap, Marker } from 'vue3-google-map';
import RateRestaurant from './RateRestaurant.vue';
import veganPinUrl from '../assets/markers/Vegan-pin.svg';

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const center = ref({ lat: 32.9599, lng: -96.7718 }); // Richardson
const places = ref([]);
const selectedPlace = ref(null);
const mapOptions = {
  styles: [
    { featureType: "poi", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { featureType: "poi", elementType: "labels.text.fill", stylers: [{ visibility: "off" }] },
    { featureType: "poi", elementType: "labels.text.stroke", stylers: [{ visibility: "off" }] },
    { featureType: "transit", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { featureType: "poi.business", stylers: [{ visibility: "off" }] },
    { featureType: "transit", stylers: [{ visibility: "off" }] },
    { featureType: "road", elementType: "labels", stylers: [{ visibility: "simplified" }] },
  ],
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
};

async function fetchRestaurants() {
  try {
    const response = await fetch('http://localhost:3001/api/restaurant-locations');
    const result = await response.json();
    places.value = result.data; // array of { name, lat, lng, placeId }
  } catch (error) {
    console.error("Failed to fetch restaurant locations:", error);
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
      :options="mapOptions"
      style="width: 100%; height: 100%;"
    >
    <Marker
      v-for="place in places"
      :key="place.placeId"
      :options="{
        position: {
          lat: place.lat,
          lng: place.lng
        },
        title: place.name,
        icon: {
          url: veganPinUrl,
          scaledSize: { width: 40, height: 40 } // scales the pin
        }
      }"
    />
    </GoogleMap>
  </div>
</template>
