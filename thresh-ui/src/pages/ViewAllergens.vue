<script setup>
import { ref } from 'vue';
import logo from '/Users/aaryaamoharir/repos/cs3354-team9/thresh-ui/src/assets/edit-246.png';

const showTable = ref(false);
const isEditing = ref(false)
</script>

<template>
  <!-- Created by Aaryaa Moharir for Use Case: View Allergens -->
  <h1 class="text-2xl font-bold text-[#DDA15E] mt-8 mb-4 text-center">
    Allergen Information
  </h1>

  <!-- Dropdown Button -->
  <div class="flex justify-center mb-2 px-8">
    <!-- Edit icon -->
  <img
    :src="logo"
    alt="Edit"
    class="w-24 h-24 cursor-pointer self-end mr-2"
    @click="isEditing = !isEditing"
    title="Edit Table"
  />

  <button
    @click="showTable = !showTable"
    class="w-full px-5 bg-[#DDA15E] hover:bg-[#c98f3c] text-white font-semibold py-4 rounded shadow-md transition"
  >
    {{ showTable ? 'Hide Allergen Table' : 'Show Allergen Table' }}
  </button>
</div>

  <!-- Allergen Information Table -->
  <div v-if="showTable" class="flex justify-center px-8">
    <div class="overflow-x-auto w-full">
      <table class="min-w-full border border-[#914F3B] border-collapse rounded-lg overflow-hidden shadow-lg">
        <thead>
          <tr class="bg-[#DDA15E] text-[#914F3B]">
            <th class="px-4 py-2 border border-[#914F3B]">Item</th>
            <th class="px-4 py-2 border border-[#914F3B]">Milk</th>
            <th class="px-4 py-2 border border-[#914F3B]">Soy</th>
            <th class="px-4 py-2 border border-[#914F3B]">Egg</th>
            <th class="px-4 py-2 border border-[#914F3B]">Wheat</th>
            <th class="px-4 py-2 border border-[#914F3B]">Peanuts</th>
            <th class="px-4 py-2 border border-[#914F3B]">Tree Nuts</th>
            <th class="px-4 py-2 border border-[#914F3B]">Fish</th>
            <th class="px-4 py-2 border border-[#914F3B]">Shellfish</th>
            <th class="px-4 py-2 border border-[#914F3B]">Sesame</th>
            <th class="px-4 py-2 border border-[#914F3B]">Gluten</th>
            <th class="px-4 py-2 border border-[#914F3B]">Mustard</th>
            <th class="px-4 py-2 border border-[#914F3B]">Gelatin</th>
            <th class="px-4 py-2 border border-[#914F3B]">Artificial Colors</th>
          </tr>
        </thead>
        <tbody>
          <tr class="hover:bg-red-50">
            <td class="px-4 py-2 border border-[#914F3B]">Red Ice, Original Flavors</td>
            <td class="px-4 py-2 text-center border border-[#914F3B]">✔️</td>
            <td class="px-4 py-2 text-center border border-[#914F3B]"></td>
            <td class="px-4 py-2 text-center border border-[#914F3B]"></td>
            <td class="px-4 py-2 text-center border border-[#914F3B]"></td>
            <td class="px-4 py-2 text-center border border-[#914F3B]"></td>
            <td class="px-4 py-2 text-center border border-[#914F3B]"></td>
            <td class="px-4 py-2 text-center border border-[#914F3B]"></td>
            <td class="px-4 py-2 text-center border border-[#914F3B]"></td>
            <td class="px-4 py-2 text-center border border-[#914F3B]"></td>
            <td class="px-4 py-2 text-center border border-[#914F3B]"></td>
            <td class="px-4 py-2 text-center border border-[#914F3B]"></td>
            <td class="px-4 py-2 text-center border border-[#914F3B]"></td>
            <td class="px-4 py-2 text-center border border-[#914F3B]"></td>
          </tr>
          <tbody>
          <tr v-for="(row, rowIndex) in allergens" :key="rowIndex" class="hover:bg-red-50">
            <td class="px-4 py-2 border border-[#914F3B]">{{ row.name }}</td>
            <td v-for="(value, column) in row" :key="column" class="px-4 py-2 text-center border border-[#914F3B]" @click="isEditing && toggleCheckmark(rowIndex, column)">
              <template v-if="isEditing">
                {{ value === '✔️' ? '✔️' : '' }}
              </template>
              <template v-else>
                {{ value === '✔️' ? '✔️' : '' }}
              </template>
            </td>
          </tr>
        </tbody>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
table th,
table td {
  text-align: center;
}
</style>
