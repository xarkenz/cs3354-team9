<!--
  Created by Syed Hasan for UC11: Remove Inappropriate and/or Fake Restaurants
  Now: per-item Remove button that first opens a proper “Are you sure?” modal,
  with clearly spaced “Yes, Remove” and “Cancel” buttons.
-->

<template>
  <div class="p-8 max-w-2xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">All Restaurants</h1>

    <!-- empty state -->
    <div v-if="!restaurants.length" class="text-gray-500">
      No restaurants found.
    </div>

    <!-- list -->
    <ul v-else class="space-y-4">
      <li
        v-for="r in restaurants"
        :key="r.id"
        class="flex justify-between items-start bg-white border rounded-lg p-4 shadow"
      >
        <div>
          <p class="font-semibold text-lg">{{ r.name }}</p>
          <p class="text-gray-600 mt-1">ID: {{ r.id }}</p>
        </div>
        <button
          @click="promptRemoval(r)"
          class="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
        >
          Remove
        </button>
      </li>
    </ul>

    <!-- confirmation modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center"
    >
      <div class="bg-white rounded-lg p-6 w-80 space-y-4">
        <h2 class="text-xl font-semibold">Confirm Removal</h2>
        <p>
          Are you sure you want to permanently remove
          <strong>"{{ selected.name }}"</strong>?
        </p>
        <div class="mt-4 flex justify-end space-x-4">
          <button
            @click="removeRestaurant"
            class="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
          >
            Yes, Remove
          </button>
          <button
            @click="cancelRemoval"
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- feedback -->
    <p v-if="successMsg" class="mt-6 text-green-600 font-medium">{{ successMsg }}</p>
    <p v-if="errorMsg"   class="mt-6 text-red-600 font-medium">{{ errorMsg }}</p>
  </div>
</template>

<script>
import { useCookies } from 'vue3-cookies'
const { cookies } = useCookies()

export default {
  name: 'RemoveRestaurant',
  data() {
    return {
      restaurants: [],
      showModal: false,
      selected: null,
      successMsg: '',
      errorMsg: ''
    };
  },
  methods: {
    async fetchRestaurants() {
      try {
        const res = await fetch('/api/restaurants', {
          headers: {
            'Content-Type': 'application/json',
            'mycookies': `session=${cookies.get('session')}`
          }
        });
        const json = await res.json();
        this.restaurants = json.restaurants || json.data || [];
        this.errorMsg = '';
      } catch (err) {
        console.error(err);
        this.errorMsg = 'Failed to load restaurants.';
      }
    },

    promptRemoval(r) {
      this.selected   = r;
      this.successMsg = '';
      this.errorMsg   = '';
      this.showModal  = true;
    },

    cancelRemoval() {
      this.showModal = false;
      this.selected  = null;
    },

    async removeRestaurant() {
      this.showModal = false;
      try {
        const res = await fetch(`/api/restaurants/${this.selected.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'mycookies': `session=${cookies.get('session')}`
          }
        });
        const json = await res.json();
        if (!res.ok || json.error) throw new Error(json.error || 'Deletion failed.');

        // remove locally
        this.restaurants = this.restaurants.filter(r => r.id !== this.selected.id);
        this.successMsg  = `"${this.selected.name}" has been removed successfully.`;
      } catch (err) {
        console.error(err);
        this.errorMsg = `Failed to remove "${this.selected.name}".`;
      } finally {
        this.selected = null;
      }
    }
  },
  mounted() {
    this.fetchRestaurants();
  }
}
</script>

<style scoped>
/* All styling is handled by your Tailwind config */
</style>

