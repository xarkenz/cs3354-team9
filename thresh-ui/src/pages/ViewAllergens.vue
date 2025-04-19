<script setup>
import { onMounted, ref, reactive } from 'vue';
import logo from './../assets/edit-246.png';

// stores dishes in edit more and expanded state
const expandedDishes = reactive({});
const editingDishes = reactive({});

onMounted(async () => {
  try {
    const response = await fetch('/api/dishes');
    const data = await response.json();
    console.log('Data from backend:', data); 
  } catch (error) {
    console.error('API fetch failed:', error);
  }
});

// allergens we're keeping track of 
const dishes = ref([
  {
    id: 1,
    name: "Red Ice, Original Flavors",
    allergens: {
      milk: true,
      soy: false,
      egg: false,
      wheat: false,
      peanuts: false,
      treeNuts: false,
      fish: false,
      shellfish: false,
      sesame: false,
      gluten: false,
      mustard: false,
      gelatin: false,
      artificialColors: false
    }
  },
  {
    id: 2,
    name: "Chocolate Cake",
    allergens: {
      milk: true,
      soy: true,
      egg: true,
      wheat: true,
      peanuts: false,
      treeNuts: true,
      fish: false,
      shellfish: false,
      sesame: false,
      gluten: true,
      mustard: false,
      gelatin: false,
      artificialColors: false
    }
  },
  {
    id: 3,
    name: "Caesar Salad",
    allergens: {
      milk: false,
      soy: false,
      egg: true,
      wheat: false,
      peanuts: false,
      treeNuts: false,
      fish: true,
      shellfish: false,
      sesame: false,
      gluten: false,
      mustard: false,
      gelatin: false,
      artificialColors: false
    }
  }
]);

// toggle the expanded state of a dish
const toggleDish = (dishId) => {
  expandedDishes[dishId] = !expandedDishes[dishId];
  // If we're collapsing the dish, also exit edit mode
  if (!expandedDishes[dishId]) {
    editingDishes[dishId] = false;
  }
};

// toggle the edit mode for the fish 
const toggleEditMode = (dishId) => {
  editingDishes[dishId] = !editingDishes[dishId];
  // If we're entering edit mode, make sure the dish is expanded
  if (editingDishes[dishId]) {
    expandedDishes[dishId] = true;
  }
};

// toggle an allergen 
const toggleAllergen = (dishId, allergen) => {
  if (editingDishes[dishId]) {
    const dish = dishes.value.find(d => d.id === dishId);
    if (dish) {
      dish.allergens[allergen] = !dish.allergens[allergen];
    }
  }
};

// allergen header
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
</script>

<template>
  <div class="allergen-info-container">
    <h1 class="text-2xl font-bold text-[#BC6C25] mt-8 mb-4 text-center">
      Allergen Information
    </h1>

    <!-- Dish List with Dropdown Buttons -->
    <div class="px-8 space-y-4">
      <div v-for="dish in dishes" :key="dish.id" class="border border-[#DDA15E] rounded-lg overflow-hidden shadow-md">
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
                    <td v-for="(header, index) in allergenHeaders" :key="index" 
                        class="px-4 py-2 text-center border border-[#914F3B]"
                        :class="{ 'cursor-pointer': editingDishes[dish.id] }"
                        @click="toggleAllergen(dish.id, Object.keys(allergenMap).find(key => allergenMap[key] === header))">
                      {{ dish.allergens[Object.keys(allergenMap).find(key => allergenMap[key] === header)] ? '✔️' : '' }}
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