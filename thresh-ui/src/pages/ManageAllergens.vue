<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-4">Manage Allergens</h1>
    <div v-if="error" class="text-red-600 mb-2">{{ error }}</div>
    <div v-if="success" class="text-green-600 mb-2">{{ success }}</div>

    <table class="min-w-full bg-white border">
      <thead>
        <tr>
          <th class="px-4 py-2 border">ID</th>
          <th class="px-4 py-2 border">Allergen</th>
          <th class="px-4 py-2 border">Restaurant</th>
          <th class="px-4 py-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="a in allergens" :key="a.id" class="hover:bg-gray-50">
          <td class="px-4 py-2 border">{{ a.id }}</td>
          <td class="px-4 py-2 border">{{ a.name }}</td>
          <td class="px-4 py-2 border">{{ a.restaurant.name }}</td>
          <td class="px-4 py-2 border">
            <button
              @click="confirmDelete(a)"
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
        <p>Delete allergen</p>
        <p class="font-semibold mt-2">“{{ selected.name }}”?</p>
        <div class="mt-4 flex justify-end space-x-4">
          <button
            @click="deleteAllergen"
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

const allergens = ref([])
const error = ref('')
const success = ref('')
const showModal = ref(false)
const selected = ref(null)

async function fetchAllergens() {
  try {
    const res = await fetch('http://localhost:3000/api/admin/allergens')
    const json = await res.json()
    allergens.value = json.allergens
  } catch {
    error.value = 'Failed to load allergen records.'
  }
}

function confirmDelete(a) {
  selected.value = a
  error.value = success.value = ''
  showModal.value = true
}

function cancel() {
  showModal.value = false
  selected.value = null
}

async function deleteAllergen() {
  try {
    await fetch(
      `http://localhost:3000/api/admin/allergens/${selected.value.id}`,
      { method: 'DELETE' }
    )
    success.value = `"${selected.value.name}" deleted.`
    allergens.value = allergens.value.filter(x => x.id !== selected.value.id)
  } catch {
    error.value = 'Deletion failed.'
  } finally {
    showModal.value = false
    selected.value = null
  }
}

onMounted(fetchAllergens)
</script>
