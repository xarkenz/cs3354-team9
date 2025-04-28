<template>
  <div class="p-8 max-w-2xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Manage Restaurants</h1>

    <!-- empty state -->
    <div v-if="!restaurants.length" class="text-gray-500">
      No restaurants found.
    </div>

    <!-- list -->
    <ul v-else class="space-y-4">
      <li
        v-for="r in restaurants"
        :key="r.id"
        class="flex justify-between items-center bg-white border rounded-lg p-4 shadow"
      >
        <div>
          <p class="font-semibold text-lg">{{ r.name }}</p>
          <p class="text-gray-600">ID: {{ r.id }}</p>
        </div>
        <button
          @click="promptDelete(r)"
          class="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
        >
          Remove
        </button>
      </li>
    </ul>

    <!-- confirm modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center"
    >
      <div class="bg-white rounded-lg p-6 w-80 space-y-4">
        <h2 class="text-xl font-semibold">Confirm Removal</h2>
        <p>
          Permanently remove
          <strong>"{{ selected.name }}"</strong>?
        </p>
        <div class="mt-4 flex justify-end space-x-4">
          <button
            @click="confirmDelete"
            class="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
          >
            Yes, Remove
          </button>
          <button
            @click="cancelDelete"
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

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
  name: 'ManageRestaurants',
  data() {
    return {
      restaurants: [],
      showModal: false,
      selected: null,
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
    async fetchRestaurants() {
      this.message = ''
      try {
        const res = await fetch('http://localhost:3000/api/admin/restaurants', {
          headers: { mycookies: `session=${cookies.get('session')}` }
        })
        const json = await res.json()
        this.restaurants = json.data || []
      } catch (e) {
        this.message = 'Failed to load restaurants.'
        this.isError = true
      }
    },
    promptDelete(r) {
      this.selected = r
      this.showModal = true
    },
    cancelDelete() {
      this.showModal = false
      this.selected = null
    },
    async confirmDelete() {
      try {
        await fetch(
          `http://localhost:3000/api/admin/restaurants/${this.selected.id}`,
          {
            method: 'DELETE',
            headers: { mycookies: `session=${cookies.get('session')}` }
          }
        )
        this.message = `"${this.selected.name}" removed.`
        this.isError = false
        this.showModal = false
        this.selected = null
        this.fetchRestaurants()
      } catch (e) {
        this.message = 'Failed to delete restaurant.'
        this.isError = true
      }
    }
  },
  mounted() {
    this.fetchRestaurants()
  }
}
</script>
