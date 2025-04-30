
 <!-- 
 Author: Neel Suresh
 UC03: Filter Search Results
 UC04: Search for restaurant
 -->
 
<template>
  <div class="filter-search-page">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <h1>Find Restaurants</h1>
        <p class="subtitle">Search for restaurants that meet your dietary needs</p>
      </div>

      <!-- Search bar -->
      <div class="search-bar">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search for restaurants..."
          class="search-input"
        />
        <button @click="applyFilters" class="search-button">
          Search
        </button>
      </div>

      <!-- Filter section -->
      <div class="filter-section">
        <h2 class="filter-heading">Filters</h2>
        <div class="filters">
          <div class="filter-group">
            <label>Allergy</label>
            <select v-model="selectedAllergy" class="filter-select">
              <option disabled value="">Select Allergy</option>
              <option>Peanut</option>
              <option>Gluten</option>
              <option>Dairy</option>
              <option>None</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Dietary Restriction</label>
            <select v-model="selectedDietaryRestriction" class="filter-select">
              <option disabled value="">Select Dietary Restriction</option>
              <option>Vegan</option>
              <option>Vegetarian</option>
              <option>Halal</option>
              <option>None</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Price Range</label>
            <select v-model="selectedPrice" class="filter-select">
              <option disabled value="">Select Price Range</option>
              <option>$</option>
              <option>$$</option>
              <option>$$$</option>
              <option>$$$$</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Cuisine</label>
            <select v-model="selectedCuisine" class="filter-select">
              <option disabled value="">Select Cuisine</option>
              <option>Italian</option>
              <option>Mexican</option>
              <option>Chinese</option>
              <option>Indian</option>
              <option>American</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Distance</label>
            <select v-model="selectedLocation" class="filter-select">
              <option disabled value="">Select Location</option>
              <option>Within 1 mile</option>
              <option>Within 5 miles</option>
              <option>Within 10 miles</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Results section -->
      <div class="results-section" v-if="results.length">
        <h2 class="results-heading">{{ results.length }} Matching Restaurants</h2>
        <div class="results-grid">
          <div v-for="restaurant in results" :key="restaurant.name" class="restaurant-card">
            <div class="restaurant-header">
              <h3 class="restaurant-name">{{ restaurant.name }}</h3>
              <div class="price-tag">{{ restaurant.price }}</div>
            </div>
            
            <div class="restaurant-details">
              <div class="detail-item">
                <span class="detail-label">Cuisine:</span>
                <span class="detail-value">{{ restaurant.cuisine }}</span>
              </div>
              
              <div class="detail-item">
                <span class="detail-label">Location:</span>
                <span class="detail-value">{{ restaurant.location }}</span>
              </div>
              
              <div class="detail-item">
                <span class="detail-label">Allergy-Safe:</span>
                <span class="detail-value">{{ restaurant.allergy }}</span>
              </div>
              
              <div class="detail-item">
                <span class="detail-label">Dietary:</span>
                <span class="detail-value">{{ restaurant.dietaryRestriction }}</span>
              </div>
            </div>
            
            <div class="restaurant-actions">
              <button 
                @click="viewAllergensFor(restaurant)" 
                class="view-allergens-button">
                View Dishes & Allergens
              </button>
              <button 
                @click="rateRestaurant(restaurant)" 
                class="rate-restaurant-button">
                Rate Restaurant
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- No results message -->
      <div class="no-results" v-else-if="hasSearched">
        <div class="no-results-content">
          <p>No matching restaurants found.</p>
          <p class="no-results-tip">Try adjusting your filters for more results.</p>
        </div>
      </div>
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
    },
    viewAllergensFor(restaurant) {
      const encodedName = encodeURIComponent(restaurant.name);
      //window.location.hash = `/view-allergens/${encodedName}`;
      window.location.hash = `/view-allergens`; 
    },
    rateRestaurant(restaurant) {
      const encodedName = encodeURIComponent(restaurant.name);
      //window.location.hash = `/rate-restaurant/${encodedName}`;
      window.location.hash = `/rate-restaurant`; 
    }
  }
};
</script>

<style scoped>
.filter-search-page {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #606C38;
  color: #283618;
  min-height: 100vh;
  padding: 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px 0;
}

.header h1 {
  font-size: 2.5rem;
  margin: 0;
  color: #F0EFEB;
  font-weight: 600;
}

.subtitle {
  color: #F0EFEB;
  margin-top: 8px;
}

.search-bar {
  display: flex;
  max-width: 800px;
  margin: 0 auto 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  background-color: white;
}

.search-input {
  flex: 1;
  padding: 15px 20px;
  font-size: 1rem;
  border: none;
  outline: none;
  color: #283618;
}

.search-button {
  padding: 15px 30px;
  background-color: #DDA15E;
  color: white;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-button:hover {
  background-color: #BC6C25;
}

.filter-section {
  margin-bottom: 40px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-heading {
  font-size: 1.4rem;
  color: #DDA15E;
  margin-top: 0;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 600;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.filter-group {
  flex: 1;
  min-width: 200px;
}

.filter-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #283618;
}

.filter-select {
  width: 100%;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.95rem;
  background-color: #fff;
  color: #283618;
}

.results-section {
  margin-bottom: 40px;
}

.results-heading {
  font-size: 1.4rem;
  color: #DDA15E;
  margin-top: 0;
  margin-bottom: 20px;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.restaurant-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.restaurant-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.restaurant-header {
  padding: 15px 20px;
  background-color: #f3f4f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.restaurant-name {
  margin: 0;
  font-size: 1.2rem;
  color: #BC6C25;
}

.price-tag {
  background-color: #BC6C25;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
}

.restaurant-details {
  padding: 15px 20px;
}

.detail-item {
  margin-bottom: 8px;
  display: flex;
}

.detail-label {
  flex: 0 0 80px;
  font-weight: 500;
  color: #4b5563;
}

.detail-value {
  flex: 1;
  color: #1f2937;
}

.restaurant-actions {
  padding: 15px 20px;
  border-top: 1px solid #e5e7eb;
  text-align: center;
}

.rate-restaurant-button {
  background-color: #4f46e5;
  color: white;
}

.rate-restaurant-button:hover {
  background-color: #4338ca;
}

.view-allergens-button,
.rate-restaurant-button {
  width: 100%;
  padding: 10px 15px;
  background-color: #914F3B;
  color: white;
  border: none;
  border-radius: 6px;
  margin-bottom: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.view-allergens-button:hover {
  background-color: #7a3d2f;
}

.no-results {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.no-results-content {
  text-align: center;
  color: #F0EFEB;
}

.no-results-tip {
  font-style: italic;
  margin-top: 10px;
}
</style>
