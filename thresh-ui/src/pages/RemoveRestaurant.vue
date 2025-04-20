<!--
  Created by Syed Hasan for UC11: Remove Inappropriate and/or Fake Restaurants
  — now with batch‑select checkboxes, Tailwind-based spacing, and a clearer confirm step.
-->

<template>
  <div class="p-8 max-w-3xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Flagged Restaurants</h1>

    <!-- empty state -->
    <div v-if="!restaurants.length" class="text-gray-500">
      No flagged restaurants to review.
    </div>

    <!-- list with checkboxes -->
    <ul v-else class="space-y-4">
      <li
        v-for="r in restaurants"
        :key="r.id"
        class="flex items-start bg-white border rounded-lg p-4 shadow-sm"
      >
        <input
          type="checkbox"
          v-model="selectedIds"
          :value="r.id"
          class="mt-1 h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
        />
        <div class="ml-4 flex-1">
          <p class="font-medium text-lg">{{ r.name }}</p>
          <p class="text-sm text-gray-600 mt-1">Reason: {{ r.flagReason }}</p>
        </div>
      </li>
    </ul>

    <!-- remove button -->
    <div class="mt-6">
      <button
        @click="openModal"
        :disabled="!selectedIds.length"
        class="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white font-semibold py-2 px-6 rounded-lg transition"
      >
        Remove Selected ({{ selectedIds.length }})
      </button>
    </div>

    <!-- confirmation Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40"
    >
      <div class="bg-white rounded-xl p-6 w-96 space-y-4 shadow-lg">
        <h2 class="text-xl font-semibold">Confirm Removal</h2>
        <p>Are you sure you want to permanently remove these restaurant(s)?</p>
        <ul class="list-disc list-inside text-gray-700 space-y-1">
          <li v-for="r in toRemove" :key="r.id">{{ r.name }}</li>
        </ul>
        <div class="mt-4 flex justify-end space-x-4">
          <button
            @click="confirmRemoval"
            class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Yes, Remove
          </button>
          <button
            @click="cancelRemoval"
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- feedback messages -->
    <div v-if="successMessage" class="mt-6 text-green-600 font-medium">
      {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="mt-6 text-red-600 font-medium">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'RemoveRestaurant',
  data() {
    return {
      restaurants: [],     //all flagged restaurants
      selectedIds: [],     //ids currently checked
      showModal: false,    //controls the confirm dialog
      successMessage: '',  //"removed" feedback
      errorMessage: ''     //error feedback
    };
  },
  computed: {
    //pull the actual restaurant objects for display in the modal
    toRemove() {
      return this.restaurants.filter(r => this.selectedIds.includes(r.id));
    }
  },
  methods: {
    //load flagged restaurants from backend
    async fetchFlagged() {
      try {
        const res = await fetch('/api/admin/flagged-restaurants');
        this.restaurants = await res.json();
      } catch {
        this.errorMessage = 'Failed to load flagged restaurants.';
      }
    },
    //open the modal
    openModal() {
      this.successMessage = '';
      this.errorMessage = '';
      this.showModal = true;
    },
    // cancel out of the modal
    cancelRemoval() {
      this.showModal = false;
    },
    //call delete for each selected ID, update list, show feedback
    async confirmRemoval() {
      this.showModal = false;
      const removedNames = [];

      for (const id of this.selectedIds) {
        try {
          const res = await fetch(`/api/admin/restaurants/${id}`, { method: 'DELETE' });
          if (!res.ok) throw new Error();
          const idx = this.restaurants.findIndex(r => r.id === id);
          if (idx !== -1) {
            removedNames.push(this.restaurants[idx].name);
            this.restaurants.splice(idx, 1);
          }
        } catch {
          this.errorMessage = 'Some removals failed. Please try again.';
        }
      }

      if (removedNames.length) {
        this.successMessage = `Removed: ${removedNames.join(', ')}`;
      }
      //clear selection
      this.selectedIds = [];
    }
  },
  mounted() {
    this.fetchFlagged();
  }
};
</script>

<style scoped>
/* nothing extra needed—Tailwind classes handle spacing & styling */
</style>
