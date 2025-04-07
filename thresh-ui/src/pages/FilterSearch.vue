<!-- 
Author: Neel Suresh
UC03: Filter Search Results
UC04: Search for restaurant
-->

<template>
  <div class="filter-search-page">
    <!-- Create a search bar for user to search for resaturants -->
    <div class="search-bar">
      <input v-model="searchQuery" type="text" placeholder="Search for restaurants..." />
      <button @click="applyFilters">Search</button>
    </div>

    <!-- Create a drop down menu for each of the available filtering options -->
    <div class="filters">
      <select v-model="selectedAllergy">
        <option disabled value="">Select Allergy</option>
        <option>Peanut</option>
        <option>Gluten</option>
        <option>Dairy</option>
        <option>None</option>
      </select>

      <select v-model="selectedDietaryRestriction">
        <option disabled value="">Select Dietary Restriction</option>
        <option>Vegan</option>
        <option>Vegetarian</option>
        <option>Halal</option>
        <option>None</option>
      </select>

      <select v-model="selectedPrice">
        <option disabled value="">Select Price Range</option>
        <option>$</option>
        <option>$$</option>
        <option>$$$</option>
        <option>$$$$</option>
      </select>

      <select v-model="selectedCuisine">
        <option disabled value="">Select Cuisine</option>
        <option>Italian</option>
        <option>Mexican</option>
        <option>Chinese</option>
        <option>Indian</option>
        <option>American</option>
      </select>

      <select v-model="selectedLocation">
        <option disabled value="">Select Location</option>
        <option>Within 1 mile</option>
        <option>Within 5 miles</option>
        <option>Within 10 miles</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FilterSearch',

  data() {
    return {
      searchQuery: '', // What the user searches for
      selectedAllergy: '', // Selected allergy 
      selectedDietaryRestriction: '', // Selected dietary restriction 
      selectedPrice: '', // Selected price range
      selectedCuisine: '', // Selected cuisine 
      selectedLocation: '' // Selected location
    };
  },

  methods: {
    // This method will collect all the filters selected by the user and find matching restaurants
    applyFilters() {
      // Later, this can be connected to a database of available restaurants
      
      console.log('Applying Filters:', {
        searchQuery: this.searchQuery,
        allergy: this.selectedAllergy,
        dietaryRestriction: this.selectedDietaryRestriction,
        price: this.selectedPrice,
        cuisine: this.selectedCuisine,
        location: this.selectedLocation
      });
    },
  }
}
</script>

<style scoped>
/* More in depth styles can be added later */
.search-bar {
  margin-bottom: 20px;
}

.filters select {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
  