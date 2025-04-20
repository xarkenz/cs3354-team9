<script setup>
import { ref, onMounted } from 'vue';
import { GoogleMap, Marker } from 'vue3-google-map';
import veganPinUrl from '../assets/markers/Vegan-pin.svg';
import RestaurantPanel from './RestaurantPanel.vue';

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const center = ref({ lat: 32.9599, lng: -96.7718 }); // Richardson
const places = ref([]);
const selectedPlace = ref(null);
const mapRef = ref(null); // Will hold the raw Google Map instance
const mapComponentRef = ref(null); // Optional, in case you need the Vue component
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

function handleMapLoad(map) {
  console.log("Map loaded:", map);
  mapRef.value = map; // Save raw Google Maps instance
}

onMounted(fetchRestaurants);

function handleMarkerClick(place) {
  selectedPlace.value = place;
  center.value = { lat: place.lat, lng: place.lng };

  if (mapRef.value && typeof mapRef.value.panTo === 'function') {
    mapRef.value.panTo({ lat: place.lat, lng: place.lng });
  } else {
    console.warn("Map instance not ready or panTo not found");
  }
}
</script>

<template>
  <div class="w-screen h-screen flex flex-row-reverse">
    <!-- Map -->
    <div class="flex-1 relative">
      <GoogleMap
        ref="mapComponentRef"
        @load="handleMapLoad"
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
          @click="() => handleMarkerClick(place)"
        />
      </GoogleMap>
    </div>

    <!-- Side Panel -->
    <transition
      enter-active-class="transition transform duration-300"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition transform duration-300"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <div
        v-if="selectedPlace !== null && selectedPlace.id"
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
