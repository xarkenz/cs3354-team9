<template>
  <div class="p-8 max-w-2xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Manage Allergen Records</h1>

    <!-- empty state -->
    <div v-if="!records.length" class="text-gray-500">
      No allergen records found.
    </div>

    <!-- list -->
    <ul v-else class="space-y-4">
      <li
        v-for="r in records"
        :key="r.id"
        class="flex justify-between items-center bg-white border rounded-lg p-4 shadow"
      >
        <div>
          <p class="font-semibold">{{ r.id }} → Dish #{{ r.dishId }}</p>
          <p class="text-gray-600">Allergen: {{ r.allergen }}</p>
        </div>
        <button
          @click="deleteRecord(r.id)"
          class="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded"
        >
          Delete
        </button>
      </li>
    </ul>

    <!-- feedback -->
    <p v-if="message" :class="messageClass" class="mt-6 font-medium">
      {{ message }}
    </p>
  </div>
</template>

<script>
import { useCookies } from 'vue3-cookies'
const { cookies } = useCookies()

export default {
  name: 'ManageAllergens',
  data() {
    return {
      records: [],
      message: '',
      isError: false,
    }
  },
  computed: {
    messageClass() {
      return this.isError ? 'text-red-600' : 'text-green-600'
    }
  },
  methods: {
    async fetchRecords() {
      this.message = ''
      try {
        const res = await fetch('http://localhost:3000/api/admin/allergens', {
          headers: { mycookies: `session=${cookies.get('session')}` }
        })
        const json = await res.json()
        this.records = json.data || []
      } catch (e) {
        this.message = 'Failed to load allergen records.'
        this.isError = true
      }
    },
    async deleteRecord(id) {
      try {
        await fetch(`http://localhost:3000/api/admin/allergens/${id}`, {
          method: 'DELETE',
          headers: { mycookies: `session=${cookies.get('session')}` }
        })
        this.message = `Record ${id} removed.`
        this.isError = false
        this.fetchRecords()
      } catch (e) {
        this.message = 'Failed to delete record.'
        this.isError = true
      }
    }
  },
  mounted() {
    this.fetchRecords()
  }
}
</script>
