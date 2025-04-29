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

// Define all possible allergens for your application
const allergenHeaders = [
  "Milk", "Soy", "Egg", "Wheat", "Peanuts", "Tree Nuts", "Fish", 
  "Shellfish", "Sesame", "Gluten", "Mustard", "Gelatin", "Artificial Colors"
];

// Map of the properties 
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

// Convert allergen keys to lowercase for case-insensitive matching
const normalizeAllergenKey = (key) => {
  return key.toLowerCase().replace(/\s+/g, '');
};

// Fetch data on component mount
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

// Function to get allergen status for a specific dish and allergen
const getAllergenStatus = (dish, allergenKey) => {
  // Find the key in allergenMap that matches the header
  const key = Object.keys(allergenMap).find(key => 
    allergenMap[key].toLowerCase() === allergenKey.toLowerCase()
  );
  
  if (!key) return "unidentified";
  
  // Convert arrays to lowercase for case-insensitive comparison
  const normalizedAllergens = dish.allergens?.map(a => a.toLowerCase()) || [];
  const normalizedAllergenFree = dish.allergenFree?.map(a => a.toLowerCase()) || [];
  
  // Check if the allergen is in the allergens array
  if (normalizedAllergens.includes(key.toLowerCase())) {
    return true;
  }
  // Check if the allergen is in the allergenFree array
  else if (normalizedAllergenFree.includes(key.toLowerCase())) {
    return false;
  }
  // If it's in neither array
  else {
    return "unidentified";
  }
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

// Change the selected restaurant
const changeRestaurant = (restaurant) => {
  selectedRestaurant.value = restaurant;
  // Reset expanded and editing states when changing restaurant
  Object.keys(expandedDishes).forEach(key => delete expandedDishes[key]);
  Object.keys(editingDishes).forEach(key => delete editingDishes[key]);
};

// toggle an allergen (for when we're in edit mode)
const toggleAllergen = (dishId, allergenKey) => {
  if (editingDishes[dishId] && selectedRestaurant.value) {
    const dish = selectedRestaurant.value.dishes.find(d => d.id === dishId);
    if (dish) {
      // Find the normalized key to use with our data
      const normalizedKey = normalizeAllergenKey(allergenKey);
      
      // Current status of the allergen
      const status = getAllergenStatus(dish, allergenKey);
      
      // Initialize arrays if they don't exist
      if (!dish.allergens) dish.allergens = [];
      if (!dish.allergenFree) dish.allergenFree = [];
      
      // Copy arrays to modify them
      const allergens = [...dish.allergens];
      const allergenFree = [...dish.allergenFree];
      
      // Remove from both arrays first (in case it's in either)
      dish.allergens = allergens.filter(a => normalizeAllergenKey(a) !== normalizedKey);
      dish.allergenFree = allergenFree.filter(a => normalizeAllergenKey(a) !== normalizedKey);
      
      // Toggle the status
      if (status === true) {
        // If it was in allergens, move to allergenFree
        dish.allergenFree.push(allergenKey);
      } else if (status === false) {
        // If it was in allergenFree, remove from both (make it unidentified)
        // Already removed above
      } else {
        // If it was unidentified, add to allergens
        dish.allergens.push(allergenKey);
      }
    }
  }
};
</script>

<template>
  <div class="allergen-info-container">
    <h1 class="text-2xl font-bold text-[#BC6C25] mt-8 mb-4 text-center">
      Allergen Information
    </h1>

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
                <p class="text-yellow-800 font-medium">Edit Mode Active: Click on cells to toggle allergens.</p>
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
                        :class="{ 'cursor-pointer': editingDishes[dish.id] }"
                        @click="toggleAllergen(dish.id, header)">
                      <template v-if="getAllergenStatus(dish, header) === true">
                        ✔️
                      </template>
                      <template v-else-if="getAllergenStatus(dish, header) === false">
                        X
                      </template>
                      <template v-else>
                        <!-- Empty for unidentified -->
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