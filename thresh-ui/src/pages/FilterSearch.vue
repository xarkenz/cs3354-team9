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
            <label>Dietary Restriction</label>
            <select v-model="selectedDietaryRestriction" class="filter-select">
              <option disabled value="">Select Dietary Restriction</option>
              <option>Vegan</option>
              <option>Vegetarian</option>
              <option>Halal</option>
              <option>Nuts</option>
              <option>Gluten</option>
              <option>Kosher</option>
              <option>Lactose</option>
              <option>Sesame</option>
              <option>Pescatarian</option>
              <option>Soy</option>
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
            <label>Distance</label>
            <select v-model="selectedDistance" class="filter-select">
              <option disabled value="">Select Distance</option>
              <option value="1">Within 1 mile</option>
              <option value="5">Within 5 miles</option>
              <option value="10">Within 10 miles</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading indicator -->
      <div class="loading-container" v-if="loading">
        <div class="loading-spinner"></div>
        <p>Loading restaurants...</p>
      </div>

      <!-- Results section -->
      <div class="results-section" v-if="results.length && !loading">
        <h2 class="results-heading">{{ results.length }} Matching Restaurants</h2>
        <div class="results-grid">
          <div v-for="restaurant in results" :key="restaurant.id" class="restaurant-card">
            <div class="restaurant-header">
              <h3 class="restaurant-name">{{ restaurant.name }}</h3>
              <div class="price-tag">{{ restaurant.priceRange }}</div>
            </div>
            
            <div class="restaurant-image">
              <img
                :src="restaurant.imageUrl || fallbackImage"
                :alt="restaurant.name"
                @error="handleImageError($event)"
              >
            </div>

            
            <div class="restaurant-details">
              <div class="detail-item" v-if="restaurant.cuisine">
                <span class="detail-label">Cuisine:</span>
                <span class="detail-value">{{ restaurant.cuisine }}</span>
              </div>
              
              <div class="detail-item">
                <span class="detail-label">Location:</span>
                <span class="detail-value">{{ getLocationText(restaurant) }}</span>
              </div>
              
              <div class="detail-item" v-if="restaurant.allergy">
                <span class="detail-label">Allergy-Safe:</span>
                <span class="detail-value">{{ restaurant.allergy }}</span>
              </div>
              
              <div class="detail-item" v-if="restaurant.dietaryRestriction || restaurant.icons || restaurant.icon">
                <span class="detail-label">Dietary:</span>
                <span class="detail-value">{{ getDietaryText(restaurant) }}</span>
              </div>
              
              <div class="detail-item" v-if="restaurant.reviews && restaurant.reviews.length">
                <span class="detail-label">Rating:</span>
                <span class="detail-value">{{ calculateAverageRating(restaurant.reviews) }} ★</span>
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
      <div class="no-results" v-else-if="hasSearched && !loading">
        <div class="no-results-content">
          <p>No matching restaurants found.</p>
          <p class="no-results-tip">Try adjusting your filters for more results.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import defaultImage from '../assets/default.jpg';


export default {
  name: 'FilterSearch',
  data() {
    return {
      searchQuery: '',
      selectedAllergy: '',
      selectedDietaryRestriction: '',
      selectedPrice: '',
      selectedCuisine: '',
      selectedDistance: '',
      results: [],
      hasSearched: false,
      loading: false,
      allRestaurants: [],
      userLocation: null,
      fallbackImage: defaultImage,
      error: null
    };
  },
  created() {
    this.fetchRestaurants();
    this.getUserLocation();
  },
  methods: {
    async fetchRestaurants() {
      this.loading = true;
      try {
        // Using the same API endpoint as in the AllergenInfo component
        const response = await fetch('http://localhost:3001/api/restaurant-locations-dishes');
        const result = await response.json();
        
        if (result.success) {
          console.log('Fetched restaurants:', result.data);
          this.allRestaurants = result.data;
          
          // Apply initial filters if any are set
          if (this.searchQuery || this.selectedAllergy || this.selectedDietaryRestriction || 
              this.selectedPrice || this.selectedCuisine || this.selectedDistance) {
            this.applyFilters();
          }
        } else {
          console.error('Error fetching restaurants:', result.error);
          this.error = result.error || 'Failed to fetch restaurant data';
        }
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        this.error = error.message || 'Failed to fetch restaurant data';
      } finally {
        this.loading = false;
      }
    },
    
    getUserLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
          },
          (error) => {
            console.error('Error getting user location:', error);
          }
        );
      }
    },
    
    calculateDistance(restaurant) {
      if (!this.userLocation || !restaurant.lat || !restaurant.lng) return Infinity;
      
      // calcualte the distance between two points 
      const R = 3958.8; // earth radius in miles
      const dLat = this.toRadians(restaurant.lat - this.userLocation.lat);
      const dLng = this.toRadians(restaurant.lng - this.userLocation.lng);
      
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(this.toRadians(this.userLocation.lat)) * 
        Math.cos(this.toRadians(restaurant.lat)) * 
        Math.sin(dLng/2) * Math.sin(dLng/2);
      
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      
      return distance;
    },
    
    toRadians(degrees) {
      return degrees * (Math.PI/180);
    },
    
    getLocationText(restaurant) {
      const distance = this.calculateDistance(restaurant);
      if (distance === Infinity) return 'Distance unknown';
      
      return `${distance.toFixed(1)} miles away`;
    },
    
    getDietaryText(restaurant) {
      // Display icon as a string if available
      if (restaurant.icon && typeof restaurant.icon === 'string') {
        return restaurant.icon;
      }
      // Display icons array if available
      else if (restaurant.icons && Array.isArray(restaurant.icons) && restaurant.icons.length > 0) {
        return restaurant.icons.join(', ');
      } 
      // Fall back to dietaryRestriction
      else if (restaurant.dietaryRestriction) {
        return restaurant.dietaryRestriction;
      }
      return 'None specified';
    },
    
    calculateAverageRating(reviews) {
      if (!reviews || reviews.length === 0) return 'No ratings';
      
      const sum = reviews.reduce((total, review) => total + review.numStars, 0);
      return (sum / reviews.length).toFixed(1);
    },
    
    applyFilters() {
      this.hasSearched = true;
      this.loading = true;
      
      const q = this.searchQuery.toLowerCase();
      const maxDistance = this.selectedDistance ? parseInt(this.selectedDistance) : Infinity;

      this.results = this.allRestaurants.filter(restaurant => {
        const distance = this.calculateDistance(restaurant);
        
        // Filter by search query (restaurant name)
        const matchesQuery = !q || restaurant.name.toLowerCase().includes(q);
        
        // Filter by allergy
        const matchesAllergy = !this.selectedAllergy || 
          (restaurant.allergy === this.selectedAllergy) || 
          (restaurant.dishes && this.restaurantSupportsAllergy(restaurant, this.selectedAllergy));
        
        // Filter by dietary restriction - check both dietaryRestriction field and icons array
        const matchesDietary = 
  !this.selectedDietaryRestriction || 
  this.selectedDietaryRestriction === 'None' || 
  this.restaurantSupportsDietary(restaurant, this.selectedDietaryRestriction);

        // Filter by price range
        const matchesPrice = !this.selectedPrice || restaurant.priceRange === this.selectedPrice;
        
        // Filter by cuisine
        const matchesCuisine = !this.selectedCuisine || restaurant.cuisine === this.selectedCuisine;
        
        // Filter by distance
        const matchesDistance = distance <= maxDistance;
        
        return matchesQuery && matchesAllergy && matchesDietary && 
               matchesPrice && matchesCuisine && matchesDistance;
      });
      
      this.loading = false;
    },
    
    // Helper method to check if restaurant has dishes that are safe for a specific allergy
    restaurantSupportsAllergy(restaurant, allergyType) {
      if (!restaurant.dishes || !restaurant.dishes.length) return false;
      
      // Map allergyType to the corresponding key in the allergenMap
      const allergyKey = this.getAllergyKey(allergyType);
      if (!allergyKey) return false;
      
      // Check if any dish is marked as safe for this allergy (in allergenFree array)
      return restaurant.dishes.some(dish => {
        if (!dish.allergenFree) return false;
        return dish.allergenFree.some(item => 
          item.toLowerCase() === allergyKey.toLowerCase());
      });
    },
    
    // Helper method to check if restaurant supports a specific dietary restriction
    restaurantSupportsDietary(restaurant, dietaryRestriction) {
      // Check if icon exists as a string
      if (restaurant.icon && typeof restaurant.icon === 'string') {
        // Check if the icon contains the dietary restriction (case insensitive)
        return restaurant.icon.toLowerCase().includes(dietaryRestriction.toLowerCase());
      }
      
      // Check if icons exists as an array
      else if (restaurant.icons && Array.isArray(restaurant.icons)) {
        // Check if any icon contains the dietary restriction (case insensitive)
        return restaurant.icons.some(icon => 
          icon.toLowerCase().includes(dietaryRestriction.toLowerCase()));
      }
      
      // If no icon or icons, check the dietaryRestriction field
      return restaurant.dietaryRestriction === dietaryRestriction;
    },

    handleImageError(event) {
  if (event.target.src !== this.fallbackImage) {
    event.target.src = this.fallbackImage;
  }
},


    
    // Map from frontend allergy filter to backend allergy key
    getAllergyKey(allergyType) {
      const allergyMap = {
        'Peanut': 'peanuts',
        'Gluten': 'gluten',
        'Dairy': 'milk'
      };
      
      return allergyMap[allergyType] || allergyType.toLowerCase();
    },
    
    viewAllergensFor(restaurant) {
      // Navigate to the allergen view page for this restaurant
      // Since our AllergenInfo component uses a selector, we'll use a URL parameter
      // that the AllergenInfo component can read to pre-select the restaurant
      window.location.hash = `/view-allergens/${restaurant.id}`;
    },
    
    rateRestaurant(restaurant) {
      window.location.hash = `/rate-restaurant/${restaurant.id}`;
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

.restaurant-image {
  height: 160px;
  overflow: hidden;
}

.restaurant-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: #F0EFEB;
}

.loading-spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid #DDA15E;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>