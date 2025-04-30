<!--
  Created by Syed Hasan for UC11: Report Incorrect Allergy Information
  UC11: The user flags a menu item whose allergen details are wrong so it can be reviewed.
-->

<template>
  <div class="p-6 max-w-lg mx-auto">
    <h1 class="text-2xl font-bold mb-4">Flag & Remove Allergens (Demo)</h1>

    <!-- If no items (should never happen here) -->
    <div v-if="!menuItems.length" class="text-gray-500">
      No allergen records found.
    </div>

    <!-- Hard-coded list -->
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

    <!-- confirmation modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center"
    >
      <div class="bg-white rounded-lg p-6 w-80 space-y-4">
        <h2 class="text-xl font-semibold">Confirm Removal</h2>
        <p>
          Are you sure you want to remove
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

    <!-- feedback -->
    <p v-if="successMsg" class="mt-6 text-green-600 font-medium">{{ successMsg }}</p>
  </div>
</template>

<script>
export default {
  name: 'ReportIncorrectAllergy',
  data() {
    return {
      // ← Hard-coded demo data (replace or extend as you like)
      menuItems: [
        { dishId: 1, name: 'Chocolate Cake',    allergen: 'Milk'      },
        { dishId: 1, name: 'Chocolate Cake',    allergen: 'Wheat'     },
        { dishId: 1, name: 'Chocolate Cake',    allergen: 'Egg'       },
        { dishId: 2, name: 'Fried Chicken',     allergen: 'Soy'       },
        { dishId: 2, name: 'Fried Chicken',     allergen: 'Peanuts'   },
        { dishId: 3, name: 'Shrimp Pasta',      allergen: 'Shellfish' },
        { dishId: 3, name: 'Shrimp Pasta',      allergen: 'Gluten'    }
      ],
      showModal: false,
      selected:  null,
      successMsg:'',
    }
  },
  methods: {
    promptRemoval(item) {
      this.selected   = item
      this.showModal  = true
      this.successMsg = ''
    },
    cancelRemoval() {
      this.selected  = null
      this.showModal = false
    },
    removeAllergen() {
      // remove it from the local array
      this.menuItems = this.menuItems.filter(i =>
        !(i.dishId === this.selected.dishId && i.allergen === this.selected.allergen)
      )
      this.successMsg = `"${this.selected.allergen}" removed from "${this.selected.name}".`
      this.selected   = null
      this.showModal  = false
    }
  }
}
</script>

<style scoped>
/* styling comes from your Tailwind config */
</style>
