<!--
Created by Sarah Jacob for UC12: Scroll and Zoom Map View
-->
<script setup>
import { ref, onMounted } from 'vue';
import { GoogleMap, Marker } from 'vue3-google-map';
import veganPinUrl from '../assets/markers/Vegan-pin.svg';
import RestaurantPanel from './RestaurantPanel.vue';

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const center = ref({ lat: 32.9599, lng: -96.7718 }); // Richardson
const places = ref([]);
const selectedPlace = ref(null);
const mapRef = ref(null);
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
    console.log("Fetched restaurants:", result.data);
    places.value = result.data;
  } catch (error) {
    console.error("Failed to fetch restaurant locations:", error);
  }
}

onMounted(fetchRestaurants);

function handleMarkerClick(place) {
  selectedPlace.value = place;
  center.value = { lat: place.lat, lng: place.lng };

  if (mapRef.value) {
    mapRef.value.panTo({ lat: place.lat, lng: place.lng });
  }
}
</script>

<template>
  <div class="w-screen h-screen flex flex-row-reverse">
    <!-- Displays the Map using the Google Maps JavaScript API -->
    <div class="flex-1 relative">
      <GoogleMap
        ref="mapRef"
        :api-key="apiKey"
        :center="center"
        :zoom="12"
        :options="mapOptions"
        style="width: 100%; height: 100%;"
      >
        <Marker
          v-for="place in places"
          :key="place.id"
          :options="{
            position: { lat: place.lat, lng: place.lng },
            title: place.name,
            icon: {
              url: veganPinUrl,
              scaledSize: { width: 40, height: 40 }
            }
          }"
          @click="handleMarkerClick(place)"
        />
      </GoogleMap>
    </div>

    <!-- PANEL ON LEFT -->
    <transition
  enter-active-class="transition transform duration-300"
  enter-from-class="-translate-x-full"
  enter-to-class="translate-x-0"
  leave-active-class="transition transform duration-300"
  leave-from-class="translate-x-0"
  leave-to-class="-translate-x-full"
>
  <div
    v-if="selectedPlace"
    class="w-[400px] h-full border-r shadow-lg bg-white z-10"
  >
    <RestaurantPanel
      :place="selectedPlace"
      @close="selectedPlace = null"
    />
  </div>
</transition>

  </div>
</template>
