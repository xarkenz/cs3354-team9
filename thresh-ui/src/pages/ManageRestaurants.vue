<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-4">Manage Restaurants</h1>
    <div v-if="error" class="text-red-600 mb-2">{{ error }}</div>
    <div v-if="success" class="text-green-600 mb-2">{{ success }}</div>

    <table class="min-w-full bg-white border">
      <thead>
        <tr>
          <th class="px-4 py-2 border">ID</th>
          <th class="px-4 py-2 border">Name</th>
          <th class="px-4 py-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in restaurants" :key="r.id" class="hover:bg-gray-50">
          <td class="px-4 py-2 border">{{ r.id }}</td>
          <td class="px-4 py-2 border">{{ r.name }}</td>
          <td class="px-4 py-2 border">
            <button
              @click="confirmDelete(r)"
              class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- confirmation modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
    >
      <div class="bg-white p-6 rounded shadow-lg w-80">
        <p>Are you sure you want to delete</p>
        <p class="font-semibold mt-2">“{{ selected.name }}”?</p>
        <div class="mt-4 flex justify-end space-x-4">
          <button
            @click="deleteRestaurant"
            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Yes
          </button>
          <button
            @click="cancel"
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const restaurants = ref([])
const error = ref('')
const success = ref('')
const showModal = ref(false)
const selected = ref(null)

async function fetchRestaurants() {
  try {
    const res = await fetch('http://localhost:3000/api/admin/restaurants')
    const json = await res.json()
    restaurants.value = json.restaurants
  } catch {
    error.value = 'Failed to load restaurants.'
  }
}

function confirmDelete(r) {
  selected.value = r
  error.value = success.value = ''
  showModal.value = true
}

function cancel() {
  showModal.value = false
  selected.value = null
}

async function deleteRestaurant() {
  try {
    await fetch(
      `http://localhost:3000/api/admin/restaurants/${selected.value.id}`,
      { method: 'DELETE' }
    )
    success.value = `"${selected.value.name}" deleted.`
    restaurants.value = restaurants.value.filter(r => r.id !== selected.value.id)
  } catch {
    error.value = 'Deletion failed.'
  } finally {
    showModal.value = false
    selected.value = null
  }
}

onMounted(fetchRestaurants)
</script>
