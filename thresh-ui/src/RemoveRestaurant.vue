<template>
<body>
  <div class="admin-dashboard">
    <h1>Flagged Restaurants</h1>
    <!-- List all flagged restaurants -->
    <ul>
      <li v-for="restaurant in flaggedRestaurants" :key="restaurant.id">
        <div>
          <p><strong>{{ restaurant.name }}</strong></p>
          <p>{{ restaurant.details }}</p>
          <!-- When clicked, shows a confirmation modal -->
          <button @click="confirmRemoval(restaurant)">Remove</button>
        </div>
      </li>
    </ul>
    <!-- Confirmation Modal -->
    <div v-if="showConfirmModal" class="modal">
      <p>
        Are you sure you want to permanently remove 
        <strong>{{ restaurantToRemove.name }}</strong>?
      </p>
      <button @click="removeRestaurant">Yes, Remove</button>
      <button @click="cancelRemoval">Cancel</button>
    </div>
    <!-- Success message display -->
    <div v-if="successMessage" class="success-message">
      <p>{{ successMessage }}</p>
    </div>
  </div>
  </body>
</template>

<script>
// Author: Syed Hasan
// This code is for UC11: Remove inappropriate and/or Fake Restaurants.
// It displays a list of flagged restaurants for the administrator and confirms removal of a chosen restaurant.
export default {
  name: 'RemoveRestaurant',
  data() {
    return {
      flaggedRestaurants: [],
      showConfirmModal: false,
      restaurantToRemove: null,
      successMessage: ''
    };
  },
    created() {
    // When the components are created, we fetch the list of flagged restaurants.
    this.fetchFlaggedRestaurants();
  },
  methods: {
    // Simulate an API call to fetch flagged restaurants.
    fetchFlaggedRestaurants() {
      this.flaggedRestaurants = [
        { id: 1, name: 'Fake Restaurant 1', details: 'Flagged for inappropriate content.' },
        { id: 2, name: 'Inappropriate Eatery', details: 'Flagged for fake reviews.' }
      ];
    },
  }
}
    // Opens the confirmation modal for the selected restaurant.
</script>