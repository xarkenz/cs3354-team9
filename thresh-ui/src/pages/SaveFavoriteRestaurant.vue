<template>
  <div class="save-favorite-page">
    <h2>My Favorite Restaurants</h2>

    <!-- Messages -->
    <div v-if="errorMessage" class="error-message">
      <button class="close-btn" @click="errorMessage = ''">×</button>
      {{ errorMessage }}
    </div>
    <div v-if="successMessage" class="success-message">
      <button class="close-btn" @click="successMessage = ''">×</button>
      {{ successMessage }}
    </div>

    <!-- Favorites Section -->
    <div class="favorites-section">
      <h3>Your Favorite Restaurants</h3>
      
      <div v-if="favorites.length === 0" class="no-favorites">
        <p>You haven't saved any favorites yet.</p>
      </div>
      
      <ul v-else class="favorites-list">
        <li v-for="(favorite, index) in favorites" :key="index" class="favorite-item">
          <div class="favorite-info">
            <strong>{{ favorite.name }}</strong>
            <span v-if="favorite.cuisine" class="cuisine-tag">{{ favorite.cuisine }}</span>
          </div>
          <button @click="removeFavorite(favorite)" class="remove-fav-btn">
            <span class="trash-icon">🗑️</span> Remove
          </button>
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
      favorites: [],
      errorMessage: '',
      successMessage: ''
    };
  },

  methods: {
    // removes from favorites 
    removeFavorite(favorite) {
      // finds the index from the cookie array
      const index = this.favorites.findIndex(fav => fav.name === favorite.name);
      
      if (index !== -1) {
        // Remove from array
        const removedName = this.favorites[index].name;
        this.favorites.splice(index, 1);
        
        // update cookie
        this.saveFavoritesToCookie();
        
        // Show success message
        this.showSuccess(`${removedName} removed from favorites`);
      }
    },

    // save favorites to cookies when you update 
    saveFavoritesToCookie() {
      document.cookie = `favorites=${encodeURIComponent(JSON.stringify(this.favorites))}; path=/; max-age=31536000`;
      console.log('Updated favorites:', this.favorites);
    },

    // Load favorites from cookie
    loadFavoritesFromCookie() {
      const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('favorites='));
      
      if (cookieValue) {
        try {
          const decodedValue = decodeURIComponent(cookieValue.split('=')[1]);
          this.favorites = JSON.parse(decodedValue);
          console.log('Loaded favorites from cookie:', this.favorites);
        } catch (error) {
          console.error('Error parsing favorites cookie:', error);
          this.favorites = [];
          this.showError('Unable to load your favorites');
        }
      } else {
        console.log('No favorites cookie found');
        this.favorites = [];
      }
    },

    // success message 
    showSuccess(message) {
      this.successMessage = message;
      setTimeout(() => this.successMessage = '', 3000);
    },

    // error message 
    showError(message) {
      this.errorMessage = message;
      setTimeout(() => this.errorMessage = '', 3000);
    }
  },

  mounted() {
    // Load favorites from cookie when the component mounts
    this.loadFavoritesFromCookie();
  }
};
</script>

<style scoped>
.save-favorite-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h2 {
  color: #914F3B;
  margin-bottom: 20px;
  border-bottom: 2px solid #f8bbd0;
  padding-bottom: 10px;
}

h3 {
  color: #e8f5e9;
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 18px;
}

/* Messages */
.error-message, .success-message {
  position: relative;
  padding: 12px 35px 12px 15px;
  border-radius: 6px;
  margin-bottom: 15px;
  animation: fadeIn 0.3s;
}

.error-message {
  color: #666;
  background-color: #ffebee;
  border-left: 4px solid #666;
}

.success-message {
  color: #914F3B;
  background-color: #e8f5e9;
  border-left: 4px solid #914F3B;
}

.close-btn {
  position: absolute;
  right: 10px;
  top: 10px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: inherit;
  opacity: 0.7;
}

.close-btn:hover {
  opacity: 1;
}

/* Favorites Section */
.favorites-section {
  background-color: #8b946f;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.favorites-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.favorite-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: white;
  border-radius: 8px;
  margin-bottom: 10px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.favorite-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 6px rgba(0,0,0,0.1);
}

.favorite-info {
  flex-grow: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.cuisine-tag {
  font-size: 12px;
  padding: 3px 8px;
  border-radius: 12px;
  background-color: #DDA15E;
  color: #DDA15E;
  font-weight: normal;
}

.remove-fav-btn {
  background-color: #f5f5f5;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  color: #666;
  font-size: 14px;
  transition: all 0.2s;
}

.remove-fav-btn:hover {
  background-color: #914F3B;
  color: #ffebee;
}

.trash-icon {
  font-size: 16px;
}

.no-favorites {
  text-align: center;
  padding: 30px;
  color: #914F3B;
  background-color:#914F3B;
  border-radius: 8px;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .favorite-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .remove-fav-btn {
    align-self: flex-end;
  }
}
</style>