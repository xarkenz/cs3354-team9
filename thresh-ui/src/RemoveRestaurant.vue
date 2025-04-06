// Author: Syed Hasan
// This code is for UC11: Remove inappropriate and/or Fake Restaurants.
// It displays a list of flagged restaurants for the administrator and confirms the removal of a chosen restaurant.

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
    // When the components are created, fetch the list of flagged restaurants.
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
    // Opens the confirmation modal (type of user interface element that appears on top of the main content) for the selected restaurant.
    confirmRemoval(restaurant) {
      this.restaurantToRemove = restaurant;
      this.showConfirmModal = true;
    },
    // Cancels the removal action and hides the modal.
    cancelRemoval() {
      this.showConfirmModal = false;
      this.restaurantToRemove = null;
    },
    // Removes the restaurant from the list and simulates an API deletion call.
    removeRestaurant() {
      // In a real app, make an API call here to remove the restaurant from the database.
      this.flaggedRestaurants = this.flaggedRestaurants.filter(
        r => r.id !== this.restaurantToRemove.id
      );
      this.successMessage = `${this.restaurantToRemove.name} has been removed successfully.`;
      this.showConfirmModal = false;
      this.restaurantToRemove = null;
    }
  }
};
</script>

<style scoped>
/* Basic styling for the admin dashboard component */
.admin-dashboard {
  padding: 20px;
}

.modal {
  background: rgba(0, 0, 0, 0.5);
  padding: 15px;
  margin-top: 20px;
}

.success-message {
  margin-top: 15px;
  color: green;
}
</style>
