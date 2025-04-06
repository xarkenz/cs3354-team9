<script setup>
import testImage from '@/assets/istockphoto-1457433817-612x612.jpg';
</script>

<template>
  <!-- Created by Aaryaa Moharir for Use Case: View Allergens -->
  <body>
    <div class="flex flex-col lg:flex-row items-start lg:items-center p-8 bg-gray-100 min-h-screen">
      <!-- Left Side: Image -->
      <div class="lg:w-1/2 w-full flex justify-center">
        <img
          :src="testImage"
          alt="Drinks"
          class="rounded-lg shadow-lg max-w-full h-auto lg:max-h-[500px]"
        />
      </div>

      <!-- Right Side: Allergen Information Table -->
      <div class="lg:w-1/2 w-full mt-8 lg:mt-0 lg:ml-8">
        <h1 class="text-2xl font-bold text-green-700 mb-4">Allergen Information</h1>
        <div class="overflow-x-auto">
          <table class="min-w-full border-collapse border border-green-300 bg-white rounded-lg shadow-lg">
            <thead>
              <tr class="bg-green-100 text-green-800">
                <th class="border border-green-300 px-4 py-2">Item</th>
                <th class="border border-green-300 px-4 py-2">Milk</th>
                <th class="border border-green-300 px-4 py-2">Soy</th>
                <th class="border border-green-300 px-4 py-2">Egg</th>
                <th class="border border-green-300 px-4 py-2">Wheat</th>
                <th class="border border-green-300 px-4 py-2">Peanuts</th>
                <th class="border border-green-300 px-4 py-2">Tree Nuts</th>
              </tr>
            </thead>
            <tbody>
              <!-- Example Rows -->
              <tr class="hover:bg-green-50">
                <td class="border border-green-300 px-4 py-2">Red Ice, Original Flavors</td>
                <td class="border border-green-300 px-4 py-2 text-center">✔️</td>
                <td class="border border-green-300 px-4 py-2 text-center"></td>
                <td class="border border-green-300 px-4 py-2 text-center"></td>
                <td class="border border-green-300 px-4 py-2 text-center"></td>
                <td class="border border-green-300 px-4 py-2 text-center"></td>
                <td class="border border-green-300 px-4 py-2 text-center"></td>
              </tr>
              <!-- Add more rows as necessary -->
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </body>
</template>

<style scoped>
/* Optional custom styling */
table th,
table td {
  text-align: center;
}
</style>
