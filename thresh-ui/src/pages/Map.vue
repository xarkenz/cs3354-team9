<script setup>
import RateRestaurant from './RateRestaurant.vue';

const routes = [
  {
    path: '/rate/:placeId',
    name: 'RateRestaurant',
    component: RateRestaurant,
    props: true
  },
];
</script>


<template>
    <div class="w-screen h-screen flex">
      <!-- Google Map with markers -->
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
  
  <script>
  import { defineComponent } from "vue";
  import { GoogleMap, Marker } from "vue3-google-map";
  
  export default defineComponent({
    components: { GoogleMap, Marker },
    data() {
      return {
        apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        center: { lat: 32.9599, lng: -96.7718 }, // Richardson, TX
        places: [],
        selectedPlace: null // clicked marker
      };
    },
    mounted() {
      this.fetchRestaurants();
    },
    methods: {
      async fetchRestaurants() {
        try {
          const response = await fetch(
            `http://localhost:3001/api/places?lat=${this.center.lat}&lng=${this.center.lng}&keyword=vegan`
          );
          const data = await response.json();
          this.places = data.results;
        } catch (error) {
          console.error("Failed to fetch places:", error);
        }
      }
    }
  });
  </script>
  