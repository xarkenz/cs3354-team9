<!--
  Created by Syed Hasan for UC11: Remove Inappropriate and/or Fake Restaurants
  UC11: The administrator reviews flagged (inappropriate/fake) restaurant listings and permanently removes them from the system
-->

<template>
  <div class="admin-dashboard p-6">
    <h1 class="text-2xl font-bold mb-4">Flagged Restaurants</h1>

    <!-- show placeholder when no flagged restaurants exist -->
    <div v-if="restaurants.length === 0" class="text-gray-500">
      No flagged restaurants found.
    </div>

    <!-- list of flagged restaurants -->
    <ul v-else>
      <li v-for="r in restaurants" :key="r.id" class="mb-4 flex justify-between items-center border-b pb-2">
        <div>
          <p class="font-medium">{{ r.name }}</p>
          <p class="text-sm text-gray-600">Reason: {{ r.flagReason }}</p>
        </div>
        <button
          @click="confirmRemoval(r)"
          class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Remove
        </button>
      </li>
    </ul>

    <!-- confirmation modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 class="text-xl font-semibold mb-2">Confirm Removal</h2>
        <p>Are you sure you want to remove <strong>"{{ selectedRestaurant.name }}"</strong>?</p>
        <div class="mt-4 flex justify-end space-x-2">
          <button
            @click="removeRestaurant"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Yes, Remove
          </button>
          <button
            @click="cancelRemoval"
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- success / error messages -->
    <div v-if="successMessage" class="mt-4 text-green-600">{{ successMessage }}</div>
    <div v-if="errorMessage" class="mt-4 text-red-600">{{ errorMessage }}</div>
  </div>
</template>

<script>
export default {
  name: 'RemoveRestaurant',
  data() {
    return {
      restaurants: [],         //list of flagged restaurants
      showModal: false,        //controls confirmation modal
      selectedRestaurant: null,//currently selected restaurant object
      successMessage: '',      //feedback on successful removal
      errorMessage: ''         //feedback on errors
    };
  },
  methods: {
    //fetch the list of flagged restaurants from backend
    async fetchFlagged() {
      try {
        const res = await fetch('/api/admin/flagged-restaurants');
        const data = await res.json();
        this.restaurants = data;
      } catch (err) {
        this.errorMessage = 'Failed to load flagged restaurants.';
      }
    },

    //open confirmation modal for the given restaurant
    confirmRemoval(restaurant) {
      this.selectedRestaurant = restaurant;
      this.showModal = true;
      this.successMessage = '';
      this.errorMessage = '';
    },

    //cancel removal action
    cancelRemoval() {
      this.showModal = false;
      this.selectedRestaurant = null;
    },

    //perform deletion via API and update UI
    async removeRestaurant() {
      try {
        const res = await fetch(
          `/api/admin/restaurants/${this.selectedRestaurant.id}`,
          { method: 'DELETE' }
        );
        if (!res.ok) throw new Error('Server error');
        //remove from local list
        this.restaurants = this.restaurants.filter(
          (r) => r.id !== this.selectedRestaurant.id
        );
        this.successMessage = `"${this.selectedRestaurant.name}" has been removed.`;
      } catch (err) {
        this.errorMessage = 'Failed to remove restaurant. Please try again.';
      } finally {
        this.showModal = false;
        this.selectedRestaurant = null;
      }
    }
  },
  mounted() {
    this.fetchFlagged();
  }
};
</script>

<style scoped>
/* simple styling for modal fade-in/out could be added here */
</style>
