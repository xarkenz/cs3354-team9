<!-- 
 Author: Kutsal Aksu
 UC09: Save Favorite Restaurant
 -->
<template>
  <div class="save-favorite-page">
    <h2>Restaurants</h2>

    <!-- Search and Filter Controls -->
    <div class="controls">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Search restaurants..." 
        class="search-input"
      />
      
      <select v-model="selectedCuisine" class="cuisine-select">
        <option value="all">All Cuisines</option>
        <option v-for="cuisine in availableCuisines" :key="cuisine" :value="cuisine">
          {{ cuisine }}
        </option>
      </select>
    </div>

    <!-- Messages -->
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>

    <!-- Restaurant List -->
    <div class="restaurant-list">
      <div
        v-for="restaurant in filteredRestaurants"
        :key="restaurant.id"
        class="restaurant-card"
      >
        <div class="restaurant-header">
          <h3>{{ restaurant.name }}</h3>
          <span class="rating">⭐ {{ restaurant.rating }}</span>
          <span class="price">{{ restaurant.priceRange }}</span>
        </div>
        <p class="cuisine">{{ restaurant.cuisine }}</p>
        <p class="location">{{ restaurant.location }}</p>
        <div class="actions">
          <button 
            v-if="!isRestaurantFavorited(restaurant.id)"
            @click="saveFavorite(restaurant)"
            class="save-btn"
          >
            🤍 Save to Favorites
          </button>
          <button 
            v-else 
            @click="removeFavorite(restaurant.id)"
            class="remove-btn"
          >
            🗑️ Remove from Favorites
          </button>
        </div>
      </div>
    </div>

    <!-- Favorites Section -->
    <div class="favorites-section">
      <h3>Your Favorites ({{ getFavoriteCount() }})</h3>
      <ul class="favorites-list">
        <li v-for="fav in favorites" :key="fav.id" class="favorite-item">
          {{ fav.name }} - {{ fav.cuisine }}
          <button @click="removeFavorite(fav.id)" class="remove-btn">🗑️</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "SaveFavoriteRestaurant",

  data() {
    return {
      restaurants: [], // Restaurants will be populated dynamically
      favorites: [],
      testMode: process.env.NODE_ENV === 'test',
      // New data properties for use cases
      searchQuery: '',
      selectedCuisine: 'all',
      showOnlyFavorites: false,
      errorMessage: '',
      successMessage: ''
    };
  },

  computed: {
    // Filter and sort restaurants based on user preferences
    filteredRestaurants() {
      let result = this.restaurants;
      
      // Filter by search query
      if (this.searchQuery) {
        result = result.filter(restaurant => 
          restaurant.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          restaurant.cuisine.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
      
      // Filter by cuisine
      if (this.selectedCuisine !== 'all') {
        result = result.filter(restaurant => 
          restaurant.cuisine.toLowerCase() === this.selectedCuisine.toLowerCase()
        );
      }
      
      return result;
    },

    // Get unique cuisines for filter dropdown
    availableCuisines() {
      const cuisines = new Set(this.restaurants.map(r => r.cuisine));
      return ['all', ...cuisines];
    }
  },

  methods: {
    saveFavorite(restaurant) {
      if (!restaurant || !restaurant.id) {
        this.errorMessage = 'Invalid restaurant data';
        setTimeout(() => this.errorMessage = '', 3000);
        return;
      }
      
      const exists = this.favorites.find(fav => fav.id === restaurant.id);
      if (!exists) {
        this.favorites.push(restaurant);
        this.successMessage = `Added ${restaurant.name} to favorites!`;
        setTimeout(() => this.successMessage = '', 3000);
        this.$emit('favorite-added', restaurant);
      } else {
        this.errorMessage = `${restaurant.name} is already in your favorites`;
        setTimeout(() => this.errorMessage = '', 3000);
        this.$emit('favorite-duplicate', restaurant);
      }
    },

    removeFavorite(restaurantId) {
      this.favorites = this.favorites.filter(fav => fav.id !== restaurantId);
      this.successMessage = 'Restaurant removed from favorites';
      setTimeout(() => this.successMessage = '', 3000);
      this.$emit('favorite-removed', restaurantId);
    },

    loadRestaurants() {
      // Dummy restaurant data for testing
      this.restaurants = [
        {
          id: 1,
          name: "Tasty Tacos",
          cuisine: "Mexican",
          location: "123 Main St, Dallas, TX",
          rating: 4.5,
          priceRange: "$"
        },
        {
          id: 2,
          name: "Pizza Paradise",
          cuisine: "Italian",
          location: "456 Oak Ave, Dallas, TX",
          rating: 4.2,
          priceRange: "$$"
        },
        {
          id: 3,
          name: "Sushi Sensation",
          cuisine: "Japanese",
          location: "789 Pine St, Dallas, TX",
          rating: 4.8,
          priceRange: "$$$"
        },
        {
          id: 4,
          name: "Burger Barn",
          cuisine: "American",
          location: "321 Elm St, Dallas, TX",
          rating: 3.9,
          priceRange: "$"
        },
        {
          id: 5,
          name: "Curry Corner",
          cuisine: "Indian",
          location: "654 Maple Dr, Dallas, TX",
          rating: 4.6,
          priceRange: "$$"
        }
      ];
      
      this.$emit('restaurants-loaded', this.restaurants);
    },

    // Helper method for testing
    getFavoriteCount() {
      return this.favorites.length;
    },

    // Helper method for testing
    isRestaurantFavorited(restaurantId) {
      return this.favorites.some(fav => fav.id === restaurantId);
    }
  },

  mounted() {
    this.loadRestaurants();
  }
};
</script>

<style scoped>
.save-favorite-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-input, .cuisine-select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.error-message {
  color: #d32f2f;
  background-color: #ffebee;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 10px;
}

.success-message {
  color: #388e3c;
  background-color: #e8f5e9;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 10px;
}

.restaurant-list {
  margin-bottom: 20px;
}

.restaurant-card {
  border: 1px solid #ccc;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
  background-color: white;
}

.restaurant-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.rating {
  color: #ff9800;
}

.price {
  color: #4caf50;
}

.cuisine {
  color: #666;
  font-style: italic;
}

.location {
  color: #666;
  font-size: 0.9em;
}

.actions {
  margin-top: 10px;
}

.save-btn {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.save-btn:hover {
  background-color: #d32f2f;
}

.remove-btn {
  background-color: #666;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.remove-btn:hover {
  background-color: #444;
}

.favorites-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ccc;
}

.favorites-list {
  list-style: none;
  padding: 0;
}

.favorite-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.favorite-item:last-child {
  border-bottom: none;
}
</style>
