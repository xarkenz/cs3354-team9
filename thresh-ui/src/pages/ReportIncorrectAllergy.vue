<!--
  Created by Syed Hasan for UC11: Report Incorrect Allergy Information
  UC11: The user flags a menu item whose allergen details are wrong so it can be reviewed.
-->

<template>
  <div class="p-6 max-w-lg mx-auto">
    <h1 class="text-2xl font-bold mb-4">Allergen Records</h1>

    <div v-if="!menuItems.length" class="text-gray-500">
      No allergen records found.
    </div>

    <ul v-else>
      <li
        v-for="item in menuItems"
        :key="`${item.dishId}-${item.allergen}`"
        class="mb-4 p-4 border rounded-lg flex justify-between items-center"
      >
        <div>
          <p class="font-medium">{{ item.name }}</p>
          <p class="text-sm text-gray-600">
            Allergen: <strong>{{ item.allergen }}</strong>
          </p>
        </div>
        <button
          @click="promptRemoval(item)"
          class="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
        >
          Remove
        </button>
      </li>
    </ul>

    <!-- Confirmation Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center"
    >
      <div class="bg-white rounded-lg p-6 w-80 space-y-4">
        <h2 class="text-xl font-semibold">Confirm Removal</h2>
        <p>
          Remove
          <strong>"{{ selected.allergen }}"</strong>
          from <strong>"{{ selected.name }}"</strong>?
        </p>
        <div class="mt-4 flex justify-end space-x-4">
          <button
            @click="removeAllergen"
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

    <!-- Feedback Messages -->
    <p v-if="successMsg" class="mt-6 text-green-600 font-medium">{{ successMsg }}</p>
    <p v-if="errorMsg"   class="mt-6 text-red-600 font-medium">{{ errorMsg }}</p>
  </div>
</template>

<script>
import { useCookies } from 'vue3-cookies'
const { cookies } = useCookies()

export default {
  name: 'ReportIncorrectAllergy',
  data() {
    return {
      menuItems: [],      // { dishId, name, allergen }
      showModal: false,
      selected: null,
      successMsg: '',
      errorMsg: ''
    }
  },
  methods: {
    async fetchMenu() {
      try {
        // 1) fetch all dishes (includes `allergens` JSON array)
        const res = await fetch('/api/dishes', {
          headers: {
            'Content-Type':'application/json',
            'mycookies': `session=${cookies.get('session')}`
          }
        });
        const dishes = await res.json();

        // 2) flatten to one row per allergen
        this.menuItems = dishes.flatMap(d =>
          (d.allergens || []).map(a => ({
            dishId: d.id,
            name: d.name,
            allergen: a
          }))
        );
        this.errorMsg = '';
      } catch (err) {
        console.error(err);
        this.errorMsg = 'Failed to load allergen records.';
      }
    },

    promptRemoval(item) {
      this.selected   = item;
      this.showModal  = true;
      this.successMsg = '';
      this.errorMsg   = '';
    },

    cancelRemoval() {
      this.showModal = false;
      this.selected  = null;
    },

    async removeAllergen() {
      this.showModal = false;
      try {
        const { dishId, allergen } = this.selected;
        const res = await fetch(
          `/api/dishes/${dishId}/allergens/${encodeURIComponent(allergen)}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'mycookies': `session=${cookies.get('session')}`
            }
          }
        );
        const json = await res.json();
        if (!res.ok || json.error) throw new Error(json.error || 'Deletion failed.');

        // locally remove from list
        this.menuItems = this.menuItems.filter(
          i => !(i.dishId === dishId && i.allergen === allergen)
        );
        this.successMsg = `Allergen "${allergen}" removed from "${this.selected.name}".`;
      } catch (err) {
        console.error(err);
        this.errorMsg = `Failed to remove "${this.selected.allergen}".`;
      } finally {
        this.selected = null;
      }
    }
  },
  mounted() {
    this.fetchMenu();
  }
}
</script>
