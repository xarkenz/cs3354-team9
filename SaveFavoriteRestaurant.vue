
<template>
  <div class="save-favorite-page">
    <h2>Restaurants</h2>

    <div class="restaurant-list">
      <div
        v-for="restaurant in restaurants"
        :key="restaurant.id"
        class="restaurant-card"
      >
        <p><strong>{{ restaurant.name }}</strong></p>
        <p>{{ restaurant.cuisine }} | {{ restaurant.location }}</p>
        <button @click="saveFavorite(restaurant)">
          ❤️ Save to Favorites
        </button>
      </div>
    </div>

    <h3>Your Favorites</h3>
    <ul>
      <li v-for="fav in favorites" :key="fav.id">{{ fav.name }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "SaveFavoriteRestaurant",

  data() {
    return {
      restaurants: [], // Restaurants will be populated dynamically
      favorites: []
    };
  },

  methods: {
    saveFavorite(restaurant) {
      const exists = this.favorites.find(fav => fav.id === restaurant.id);
      if (!exists) {
        this.favorites.push(restaurant);
        console.log("Saved favorite:", restaurant.name);
      } else {
        console.log("Already in favorites:", restaurant.name);
      }
    },

    // This function is just a placeholder — you could use it to load restaurants
    loadRestaurants() {
      // Example:
      // this.restaurants = fetch('/api/restaurants').then(...);
    }
  },

  mounted() {
    // Optional: Call loadRestaurants() here if connected to a real API
  }
};
</script>

<style scoped>
.restaurant-list {
  margin-bottom: 20px;
}

.restaurant-card {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 6px;
}

button {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #d32f2f;
}
</style>
