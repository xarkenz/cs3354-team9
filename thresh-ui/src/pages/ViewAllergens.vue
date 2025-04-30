<script setup>
import { onMounted, ref, reactive } from 'vue';
import logo from './../assets/edit-246.png';

// stores dishes in edit more and expanded state
const expandedDishes = reactive({});
const editingDishes = reactive({});

// Initialize reactive reference for restaurants data
const restaurants = ref([]);
const selectedRestaurant = ref(null);
const loading = ref(true);
const error = ref(null);
const notification = reactive({
  show: false,
  message: '',
  isError: false,
  timeout: null
});

// all possible allergens 
const allergenHeaders = [
  "Milk", "Soy", "Egg", "Wheat", "Peanuts", "Tree Nuts", "Fish", 
  "Shellfish", "Sesame", "Gluten", "Mustard", "Gelatin", "Artificial Colors"
];

// map of the properties  
const allergenMap = {
  milk: "Milk",
  soy: "Soy",
  egg: "Egg",
  wheat: "Wheat",
  peanuts: "Peanuts",
  treeNuts: "Tree Nuts",
  fish: "Fish",
  shellfish: "Shellfish",
  sesame: "Sesame",
  gluten: "Gluten",
  mustard: "Mustard",
  gelatin: "Gelatin",
  artificialColors: "Artificial Colors"
};

// convert allergen keys to all lowkeycase 
const normalizeAllergenKey = (key) => {
  return key.toLowerCase().replace(/\s+/g, '');
};

// fetch data 
onMounted(async () => {
  try {
    loading.value = true;
    const response = await fetch('http://localhost:3001/api/restaurant-locations-dishes');
    const result = await response.json();
    console.log("Fetched restaurants:", result.data);
    restaurants.value = result.data;
    
    // Select the first restaurant by default if available
    if (restaurants.value.length > 0) {
      selectedRestaurant.value = restaurants.value[0];
    }
    
    loading.value = false;
  } catch (error) {
    console.error('API fetch failed:', error);
    error.value = "Failed to load restaurant data";
    loading.value = false;
  }
});

// get the allergen status for a specific dish 
const getAllergenStatus = (dish, allergenKey) => {
  // Find the key in allergenMap that matches the header
  const key = Object.keys(allergenMap).find(key => 
    allergenMap[key].toLowerCase() === allergenKey.toLowerCase()
  );
  
  if (!key) return "unidentified";
  
  // convert to lowercase to compare easily 
  const normalizedAllergens = dish.allergens?.map(a => a.toLowerCase()) || [];
  const normalizedAllergenFree = dish.allergenFree?.map(a => a.toLowerCase()) || [];
  
  // is the allergen in the allergens array 
  if (normalizedAllergens.includes(key.toLowerCase())) {
    return true;
  }
  // Check if the allergen is in the allergenFree array
  else if (normalizedAllergenFree.includes(key.toLowerCase())) {
    return false;
  }
  // if it's in niether array then we say it's unidentified 
  else {
    return "unidentified";
  }
};

// Check if an allergen can be toggled (only if it's unidentified or marked as not present)
const canToggleAllergen = (dish, allergenKey) => {
  const status = getAllergenStatus(dish, allergenKey);
  return status === "unidentified" || status === false;
};

// toggle the expanded state of a dish
const toggleDish = (dishId) => {
  expandedDishes[dishId] = !expandedDishes[dishId];
  // If we're collapsing the dish, also exit edit mode
  if (!expandedDishes[dishId]) {
    editingDishes[dishId] = false;
  }
};

// toggle the edit mode for the dish
const toggleEditMode = (dishId) => {
  editingDishes[dishId] = !editingDishes[dishId];
  // If we're entering edit mode, make sure the dish is expanded
  if (editingDishes[dishId]) {
    expandedDishes[dishId] = true;
  }
};

// change the selected restaurant
const changeRestaurant = (restaurant) => {
  selectedRestaurant.value = restaurant;
  // Reset expanded and editing states when changing restaurant
  Object.keys(expandedDishes).forEach(key => delete expandedDishes[key]);
  Object.keys(editingDishes).forEach(key => delete editingDishes[key]);
};

// function to show notification
const showNotification = (message, isError = false) => {
  // Clear any existing timeout
  if (notification.timeout) {
    clearTimeout(notification.timeout);
  }
  
  // Set notification properties
  notification.message = message;
  notification.isError = isError;
  notification.show = true;
  
  // Auto-hide notification after 5 seconds
  notification.timeout = setTimeout(() => {
    notification.show = false;
  }, 5000);
};

// Function to refresh data from the server
const refreshRestaurantData = async () => {
  try {
    loading.value = true;
    const response = await fetch('http://localhost:3001/api/restaurant-locations-dishes');
    const result = await response.json();
    
    // Update restaurants array
    restaurants.value = result.data;
    
    // Find and update the selected restaurant with fresh data
    if (selectedRestaurant.value) {
      const updatedRestaurant = restaurants.value.find(r => r.id === selectedRestaurant.value.id);
      if (updatedRestaurant) {
        selectedRestaurant.value = updatedRestaurant;
      }
    }
    
    loading.value = false;
  } catch (error) {
    console.error('Failed to refresh restaurant data:', error);
    loading.value = false;
  }
};

// toggle an allergen (for when we're in edit mode)
const toggleAllergen = async (dishId, allergenKey) => {
  if (!editingDishes[dishId] || !selectedRestaurant.value) return;
  
  const dish = selectedRestaurant.value.dishes.find(d => d.id === dishId);
  if (!dish) return;
  
  // Check if this allergen can be toggled
  if (!canToggleAllergen(dish, allergenKey)) {
    showNotification("Cannot modify confirmed allergens for safety reasons", true);
    return;
  }
  
  // find the lowercase key 
  const normalizedKey = normalizeAllergenKey(allergenKey);
  
  // what's the status of the allergen
  const status = getAllergenStatus(dish, allergenKey);
  
  // if arrays don't exist, create them
  if (!dish.allergens) dish.allergens = [];
  if (!dish.allergenFree) dish.allergenFree = [];

  const allergens = [...dish.allergens];
  const allergenFree = [...dish.allergenFree];

  dish.allergens = allergens.filter(a => normalizeAllergenKey(a) !== normalizedKey);
  dish.allergenFree = allergenFree.filter(a => normalizeAllergenKey(a) !== normalizedKey);
  
  // change the status (unidentified -> allergens, allergenFree -> unidentified)
  if (status === "unidentified") {
    // If it was unidentified, mark as allergen present
    dish.allergens.push(allergenKey);
  } else if (status === false) {
    // If it was marked as not present, change to unidentified (remove from both arrays)
  }
  
  // Update the database with the changes
  try {
    // just updated information for the backend api 
    const payload = {
      dishId: dish.id,
      allergens: dish.allergens,
      allergenFree: dish.allergenFree
    };
    
    // Send the update to the server
    const response = await fetch(`http://localhost:3001/api/dishes/${dish.id}/allergens`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update allergen information');
    }
    
    console.log('Allergen information updated successfully in database');
    
    // success notification 
    showNotification('Allergen information updated successfully', false);
  } catch (error) {
    console.error('Error updating allergen information:', error);
    // error notification
    showNotification(`Error updating allergen information: ${error.message}`, true);
    
    // revert the change if needed. 
    refreshRestaurantData();
  }
};
</script>

<template>
  <div class="allergen-info-container">
    <h1 class="text-2xl font-bold text-[#BC6C25] mt-8 mb-4 text-center">
      Allergen Information
    </h1>

    <!-- Notification area for success/error messages -->
    <div v-if="notification.show" :class="`px-8 py-3 mb-4 rounded ${notification.isError ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-green-100 text-green-800 border border-green-300'}`">
      <div class="flex justify-between items-center">
        <p>{{ notification.message }}</p>
        <button @click="notification.show = false" class="text-gray-600 hover:text-gray-800">×</button>
      </div>
    </div>

    <!-- Restaurant Selector -->
    <div class="px-8 mb-6">
      <label for="restaurant-select" class="block mb-2 font-medium text-[#914F3B]">Select Restaurant:</label>
      <select 
        id="restaurant-select" 
        v-model="selectedRestaurant" 
        @change="changeRestaurant(selectedRestaurant)"
        class="w-full p-2 border border-[#DDA15E] rounded-lg bg-[#f5f0e8] focus:outline-none focus:ring-2 focus:ring-[#BC6C25]"
      >
        <option v-for="restaurant in restaurants" :key="restaurant.id" :value="restaurant">
          {{ restaurant.name }}
        </option>
      </select>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="px-8 py-4 text-center">
      <p class="text-[#914F3B]">Loading allergen information...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="px-8 py-4 text-center">
      <p class="text-red-600">{{ error }}</p>
    </div>

    <!-- No Restaurant Selected -->
    <div v-else-if="!selectedRestaurant" class="px-8 py-4 text-center">
      <p class="text-[#914F3B]">Please select a restaurant to view allergen information.</p>
    </div>

    <!-- No Dishes Available -->
    <div v-else-if="!selectedRestaurant.dishes || selectedRestaurant.dishes.length === 0" class="px-8 py-4 text-center">
      <p class="text-[#914F3B]">No dishes available for this restaurant.</p>
    </div>

    <!-- Dish List with Dropdown Buttons -->
    <div v-else class="px-8 space-y-4">
      <div v-for="dish in selectedRestaurant.dishes" :key="dish.id" class="border border-[#DDA15E] rounded-lg overflow-hidden shadow-md">
        <div class="flex items-center bg-[#f5f0e8] p-4">
          <h2 class="text-xl font-semibold text-[#914F3B] flex-grow">{{ dish.name }}</h2>
          
          <img
            :src="logo"
            alt="Edit"
            class="w-8 h-8 cursor-pointer mr-4"
            @click="toggleEditMode(dish.id)"
            :title="editingDishes[dish.id] ? 'Exit Edit Mode' : 'Edit Allergens'"
          />
          
          <button
            @click="toggleDish(dish.id)"
            class="px-4 py-2 bg-[#DDA15E] hover:bg-[#c98f3c] text-white font-semibold rounded shadow transition"
          >
            {{ expandedDishes[dish.id] ? 'Hide Allergens' : 'Show Allergens' }}
          </button>
        </div>

        <!-- Allergen Table for this dish -->
        <div v-if="expandedDishes[dish.id]" class="p-4">
          <div class="flex justify-center">
            <div class="overflow-x-auto w-full">
              <div v-if="editingDishes[dish.id]" class="bg-yellow-100 p-3 mb-3 rounded border border-yellow-400">
                <p class="text-yellow-800 font-medium">Edit Mode Active: You can only modify unidentified allergens or those marked as not present.</p>
              </div>
              
              <table class="min-w-full border border-[#914F3B] border-collapse rounded-lg overflow-hidden shadow-lg">
                <thead>
                  <tr class="bg-[#DDA15E] text-[#914F3B]">
                    <th v-for="header in allergenHeaders" :key="header" class="px-4 py-2 border border-[#914F3B]">
                      {{ header }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="hover:bg-red-50">
                    <td v-for="header in allergenHeaders" :key="header" 
                        class="px-4 py-2 text-center border border-[#914F3B]"
                        :class="{
                          'cursor-pointer': editingDishes[dish.id] && canToggleAllergen(dish, header),
                          'bg-gray-100': editingDishes[dish.id] && !canToggleAllergen(dish, header)
                        }"
                        @click="toggleAllergen(dish.id, header)">
                      <template v-if="getAllergenStatus(dish, header) === true">
                        <div class="flex justify-center items-center">
                          <span class="text-green-600 font-bold">✔️</span>
                          <span v-if="editingDishes[dish.id]" class="ml-1 text-xs text-gray-500">(Locked)</span>
                        </div>
                      </template>
                      <template v-else-if="getAllergenStatus(dish, header) === false">
                        <span class="text-red-600 font-bold">X</span>
                      </template>
                      <template v-else>
                        <!-- Empty for unidentified -->
                        <span class="text-gray-300">-</span>
                      </template>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.allergen-info-container {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

table th,
table td {
  text-align: center;
}

.cursor-pointer {
  cursor: pointer;
}

/* animation for the collapse  */
.dishes-enter-active,
.dishes-leave-active {
  transition: all 0.3s ease;
}
.dishes-enter-from,
.dishes-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>