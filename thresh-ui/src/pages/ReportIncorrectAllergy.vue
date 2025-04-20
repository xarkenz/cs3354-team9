<!--
  Created by Syed Hasan for UC11: Report Incorrect Allergy Information
  UC11: The user flags a menu item whose allergen details are wrong so it can be reviewed 
-->

<template>
  <div class="p-6 max-w-lg mx-auto">
    <h1 class="text-2xl font-bold mb-4">Report Incorrect Allergy Information</h1>

    <!-- list of menu items -->
    <ul>
      <li
        v-for="item in menuItems"
        :key="item.id"
        class="mb-4 p-4 border rounded-lg flex justify-between items-center"
      >
        <div>
          <p class="font-medium">{{ item.name }}</p>
          <p class="text-sm text-gray-600">
            Allergens: {{ item.allergens.join(', ') || 'None' }}
          </p>
        </div>
        <button
          @click="reportItem(item.id)"
          class="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
        >
          Report
        </button>
      </li>
    </ul>

    <!-- feedback message -->
    <div v-if="message" class="mt-4" :class="success ? 'text-green-600' : 'text-red-600'">
      {{ message }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReportIncorrectAllergy',
  data() {
    return {
      menuItems: [],  //menu items loaded from backend
      message: '',    //user feedback
      success: false  //whether last report succeeded
    };
  },
  methods: {
    //load all menu items
    async fetchMenu() {
      try {
        const res = await fetch('/api/menu-items');
        this.menuItems = await res.json();
      } catch {
        this.message = 'Could not load menu items.';
        this.success = false;
      }
    },
    //send a report for incorrect allergy info
    async reportItem(id) {
      try {
        const res = await fetch(`/api/reports/allergy/${id}`, { method: 'POST' });
        if (!res.ok) throw new Error();
        this.message = 'Report submitted. Thank you for your feedback!';
        this.success = true;
      } catch {
        this.message = 'Failed to submit report. Please try again later.';
        this.success = false;
      }
    }
  },
  mounted() {
    this.fetchMenu();
  }
};
</script>

<style scoped>
/* additional custom styles can go here */
</style>
