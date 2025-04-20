<template>
  <div class="filter-search-page">
    <!-- Search bar -->
    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search for restaurants..."
        class="search-input"
      />
      <button @click="applyFilters" class="search-button">Search</button>
    </div>

    <!-- Filter dropdowns -->
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

    <!-- Display results -->
    <div class="results" v-if="results.length">
      <h2>Matching Restaurants</h2>
      <div v-for="restaurant in results" :key="restaurant.name" class="restaurant-card">
        <h3>{{ restaurant.name }}</h3>
        <p><strong>Cuisine:</strong> {{ restaurant.cuisine }}</p>
        <p><strong>Price:</strong> {{ restaurant.price }}</p>
        <p><strong>Location:</strong> {{ restaurant.location }}</p>
        <p><strong>Allergy-Safe:</strong> {{ restaurant.allergy }}</p>
        <p><strong>Dietary Restriction:</strong> {{ restaurant.dietaryRestriction }}</p>
      </div>
    </div>

    <div v-else-if="hasSearched">
      <p>No matching restaurants found.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FilterSearch',
  data() {
    return {
      searchQuery: '',
      selectedAllergy: '',
      selectedDietaryRestriction: '',
      selectedPrice: '',
      selectedCuisine: '',
      selectedLocation: '',
      results: [],
      hasSearched: false,

     
      allRestaurants: [
  {
    name: 'Pizza Planet',
    cuisine: 'Italian',
    price: '$$',
    location: 'Within 5 miles',
    allergy: 'None',
    dietaryRestriction: 'Vegetarian'
  },
  {
    name: 'Spice Junction',
    cuisine: 'Indian',
    price: '$$$',
    location: 'Within 10 miles',
    allergy: 'Gluten',
    dietaryRestriction: 'Halal'
  },
  {
    name: 'Green Bowl',
    cuisine: 'American',
    price: '$',
    location: 'Within 1 mile',
    allergy: 'Dairy',
    dietaryRestriction: 'Vegan'
  },
  {
    name: 'Salsa House',
    cuisine: 'Mexican',
    price: '$$',
    location: 'Within 5 miles',
    allergy: 'Peanut',
    dietaryRestriction: 'None'
  },
  {
    name: 'Dragon Express',
    cuisine: 'Chinese',
    price: '$',
    location: 'Within 1 mile',
    allergy: 'None',
    dietaryRestriction: 'Halal'
  },
  {
    name: 'Taco Thunder',
    cuisine: 'Mexican',
    price: '$$',
    location: 'Within 5 miles',
    allergy: 'Gluten',
    dietaryRestriction: 'Vegetarian'
  },
  {
    name: 'Veggie Haven',
    cuisine: 'American',
    price: '$',
    location: 'Within 1 mile',
    allergy: 'None',
    dietaryRestriction: 'Vegan'
  },
  {
    name: 'Curry Castle',
    cuisine: 'Indian',
    price: '$$$',
    location: 'Within 10 miles',
    allergy: 'Peanut',
    dietaryRestriction: 'Vegetarian'
  },
  {
    name: 'Pizza House',
    cuisine: 'Italian',
    price: '$$$',
    location: 'Within 5 miles',
    allergy: 'Dairy',
    dietaryRestriction: 'None'
  },
  {
    name: 'Zen Garden',
    cuisine: 'Chinese',
    price: '$$',
    location: 'Within 10 miles',
    allergy: 'Gluten',
    dietaryRestriction: 'Vegan'
  },
  {
    name: 'BBQ Bros',
    cuisine: 'American',
    price: '$$',
    location: 'Within 5 miles',
    allergy: 'None',
    dietaryRestriction: 'None'
  },
  {
    name: 'Bella Napoli',
    cuisine: 'Italian',
    price: '$$',
    location: 'Within 1 mile',
    allergy: 'Dairy',
    dietaryRestriction: 'Vegetarian'
  },
  {
    name: 'Falafel Fiesta',
    cuisine: 'Indian',
    price: '$',
    location: 'Within 1 mile',
    allergy: 'Peanut',
    dietaryRestriction: 'Halal'
  },
  {
    name: 'Bamboo Wok',
    cuisine: 'Chinese',
    price: '$$',
    location: 'Within 5 miles',
    allergy: 'None',
    dietaryRestriction: 'Vegetarian'
  }
]

    };
  },
  methods: {
    applyFilters() {
      const q = this.searchQuery.toLowerCase();

      this.results = this.allRestaurants.filter(r => {
        return (
          (!q || r.name.toLowerCase().includes(q)) &&
          (!this.selectedAllergy || r.allergy === this.selectedAllergy) &&
          (!this.selectedDietaryRestriction || r.dietaryRestriction === this.selectedDietaryRestriction) &&
          (!this.selectedPrice || r.price === this.selectedPrice) &&
          (!this.selectedCuisine || r.cuisine === this.selectedCuisine) &&
          (!this.selectedLocation || r.location === this.selectedLocation)
        );
      });

      this.hasSearched = true;
    }
  }
};
</script>

<style scoped>
.filter-search-page {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.search-bar {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.search-input {
  padding: 10px;
  width: 300px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.search-button {
  padding: 10px 16px;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.filters select {
  padding: 8px;
  border-radius: 4px;
}

.results {
  margin-top: 20px;
}

.restaurant-card {
  background: #f9fafb;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 12px;
  border: 1px solid #ddd;
}
</style>

