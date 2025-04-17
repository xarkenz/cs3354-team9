<script setup>
import testImage from '@/assets/istockphoto-1457433817-612x612.jpg';
</script>

<template>
  <!-- Created by Aaryaa Moharir for Use Case: View Allergens -->
  <h1 class="absolute top-35 right-112 text-2xl font-bold" style="color: #DDA15E;">
  Allergen Information
  </h1>

  <div class="flex flex-col lg:flex-row items-start lg:items-start p-8">
    
    
    <!-- Left Side: Image -->
    <div class="lg:w-1/2 w-full flex justify-center">
      
      <img
        :src="testImage"
        alt="Drinks"
        class="rounded-lg shadow-lg w-[50vw] h-[100vh] object-cover"
      />
    </div>

    <!-- Right Side: Allergen Information Table -->
    
    <div class="lg:w-1/2 w-full mt-10 lg:mt-0 lg:ml-8 flex justify-center" >
      <div class="overflow-x-auto">
        <table class="min-w-full border border-[#914F3B] border-collapse rounded-lg overflow-hidden shadow-lg mt-[75px]">

  <thead>
    <tr class="bg-[#DDA15E] text-[#914F3B]" style="border: 1px solid #914F3B;">
      <th class="px-4 py-2"  style="border: 1px solid #914F3B;">Item</th>
      <th class="px-4 py-2" style="border: 1px solid #914F3B;">Milk</th>
      <th class="px-4 py-2" style="border: 1px solid #914F3B;">Soy</th>
      <th class="px-4 py-2" style="border: 1px solid #914F3B;">Egg</th>
      <th class="px-4 py-2" style="border: 1px solid #914F3B;">Wheat</th>
      <th class="px-4 py-2" style="border: 1px solid #914F3B;">Peanuts</th>
      <th class="px-4 py-2" style="border: 1px solid #914F3B;">Tree Nuts</th>
      <th class="px-4 py-2" style="border: 1px solid #914F3B;">Fish</th>
      <th class="px-4 py-2" style="border: 1px solid #914F3B;">Shellfish</th>
      <th class="px-4 py-2" style="border: 1px solid #914F3B;">Sesame</th>
      <th class="px-4 py-2" style="border: 1px solid #914F3B;">Gluten</th>
      <th class="px-4 py-2" style="border: 1px solid #914F3B;">Mustard</th>
      <th class="px-4 py-2" style="border: 1px solid #914F3B;">Sulfites</th>
      <th class="px-4 py-2" style="border: 1px solid #914F3B;">Lupin</th>
      <th class="px-4 py-2" style="border: 1px solid #914F3B;">Corn</th>
      <th class="px-4 py-2" style="border: 1px solid #914F3B;">MSG</th>
      <th class="px-4 py-2" style="border: 1px solid #914F3B;">Gelatin</th>
      <th class=" px-4 py-2" style="border: 1px solid #914F3B;">Artificial Colors</th>
            </tr>
          </thead>
          <tbody>
            <!-- Example Rows -->
            <tr class="hover:bg-red-50">
              <td class="px-4 py-2">Red Ice, Original Flavors</td>
              <td class="px-4 py-2 text-center" style="border: 1px solid #914F3B;">✔️</td>
              <td class="px-4 py-2 text-center" style="border: 1px solid #914F3B;"></td>
              <td class="px-4 py-2 text-center" style="border: 1px solid #914F3B;"></td>
              <td class="px-4 py-2 text-center" style="border: 1px solid #914F3B;"></td>
              <td class="px-4 py-2 text-center" style="border: 1px solid #914F3B;"></td>
              <td class="px-4 py-2 text-center" style="border: 1px solid #914F3B;"></td>
            </tr>
            <!-- Add more rows as necessary -->
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Optional custom styling */
table th,
table td {
  text-align: center;
}
</style>
