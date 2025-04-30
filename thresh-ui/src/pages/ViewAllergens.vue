<script setup>
import { onMounted, ref, reactive } from 'vue';
import logo from './../assets/edit-246.png';

// stores dishes in edit more and expanded state
const expandedDishes = reactive({});
const editingDishes = reactive({});
// dishes that are unidentified 
const pendingChanges = reactive({});

// initialize reactive reference for restaurants data
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
    // Clear any unsaved changes
    if (pendingChanges[dishId]) {
      delete pendingChanges[dishId];
    }
  }
};

// toggle the edit mode for the dish
const toggleEditMode = (dishId) => {
  // If we're exiting edit mode and have pending changes, ask for confirmation
  if (editingDishes[dishId] && pendingChanges[dishId]) {
    if (!confirm("You have unsaved changes. Are you sure you want to exit edit mode?")) {
      return;
    }
    delete pendingChanges[dishId];
  }
  
  editingDishes[dishId] = !editingDishes[dishId];
  
  // If we're entering edit mode, make sure the dish is expanded
  if (editingDishes[dishId]) {
    expandedDishes[dishId] = true;
  }
};

// change the selected restaurant
const changeRestaurant = (restaurant) => {
  // If we have pending changes, ask for confirmation
  if (Object.keys(pendingChanges).length > 0) {
    if (!confirm("You have unsaved changes. Are you sure you want to change restaurants?")) {
      return;
    }
  }
  
  selectedRestaurant.value = restaurant;
  // Reset expanded and editing states when changing restaurant
  Object.keys(expandedDishes).forEach(key => delete expandedDishes[key]);
  Object.keys(editingDishes).forEach(key => delete editingDishes[key]);
  // Clear all pending changes
  Object.keys(pendingChanges).forEach(key => delete pendingChanges[key]);
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
const toggleAllergen = (dishId, allergenKey) => {
  if (!editingDishes[dishId] || !selectedRestaurant.value) return;
  
  const dish = selectedRestaurant.value.dishes.find(d => d.id === dishId);
  if (!dish) return;
  
  // check if it can be toggled (basically is it marked with a checkmark)
  if (!canToggleAllergen(dish, allergenKey)) {
    showNotification("Cannot modify confirmed allergens for safety reasons", true);
    return;
  }
  
  // initialize pending changes for this dish if not already done
  if (!pendingChanges[dishId]) {
    pendingChanges[dishId] = {
      dishId: dish.id,
      allergens: [...(dish.allergens || [])],
      allergenFree: [...(dish.allergenFree || [])]
    };
  }
  
  // find the lowercase key 
  const normalizedKey = normalizeAllergenKey(allergenKey);
  
  // what's the status of the allergen
  const status = getAllergenStatus(dish, allergenKey);
  
  // Remove from both arrays first
  pendingChanges[dishId].allergens = pendingChanges[dishId].allergens.filter(
    a => normalizeAllergenKey(a) !== normalizedKey
  );
  pendingChanges[dishId].allergenFree = pendingChanges[dishId].allergenFree.filter(
    a => normalizeAllergenKey(a) !== normalizedKey
  );
  
  // Change the status (unidentified -> allergenFree (not present), allergenFree -> allergens (present))
  if (status === "unidentified") {
    // If it was unidentified, mark as not present first
    pendingChanges[dishId].allergenFree.push(allergenKey);
  } else if (status === false) {
    // If it was marked as not present, now mark as present
    pendingChanges[dishId].allergens.push(allergenKey);
  }
  
  // Apply pending changes to the dish for immediate UI feedback
  dish.allergens = [...pendingChanges[dishId].allergens];
  dish.allergenFree = [...pendingChanges[dishId].allergenFree];
};

// save changes to the server only if the button is pressed 
const saveChanges = async (dishId) => {
  if (!pendingChanges[dishId]) {
    showNotification("No changes to save", false);
    return;
  }
  
  try {
    loading.value = true;
    
    // Send the update to the server
    const response = await fetch(`http://localhost:3001/api/dishes/${dishId}/allergens`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pendingChanges[dishId])
    });
    
    if (!response.ok) {
      throw new Error('Failed to update allergen information');
    }
    
    console.log('Allergen information updated successfully in database');
    
    // Clear pending changes for this dish
    delete pendingChanges[dishId];
    
    // success notification 
    showNotification('Allergen information updated successfully', false);
    
    loading.value = false;
  } catch (error) {
    console.error('Error updating allergen information:', error);
    // error notification
    showNotification(`Error updating allergen information: ${error.message}`, true);
    
    // revert the change
    refreshRestaurantData();
    loading.value = false;
  }
};

// Check if there are pending changes for a dish
const hasPendingChanges = (dishId) => {
  return pendingChanges[dishId] !== undefined;
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
              <div v-if="editingDishes[dish.id]" class="bg-[#FFCC94] p-3 mb-3 rounded border border-[#4B231B]">
                <p class="text-yellow-800 font-medium">Edit Mode Active: You can only modify unidentified allergens or those marked as not present. The toggle sequence is: Empty → Not Present (X) → Present (✓).</p>
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
                          <span class="text-[#914F3B] font-bold">✔️</span>
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
              
              <!-- Save Changes Button -->
              <div v-if="editingDishes[dish.id]" class="mt-4 flex justify-end">
                <div class="flex items-center">
                  <span v-if="hasPendingChanges(dish.id)" class="text-orange-600 mr-3">
                    <strong>* Unsaved Changes</strong>
                  </span>
                  <button 
                    @click="saveChanges(dish.id)" 
                    class="px-4 py-2 bg-[#914F3B] hover:bg-[#914F3B] text-white font-semibold rounded shadow transition"
                    :disabled="!hasPendingChanges(dish.id)"
                    :class="{'opacity-50 cursor-not-allowed': !hasPendingChanges(dish.id)}"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
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