<!--
Created by Sarah Jacob for UC08: Rate a Restaurant
-->

<template>
  <div class="max-w-xl mx-auto my-8 p-6 rounded-xl shadow-lg bg-white border border-gray-200">
    <h2 class="text-2xl font-bold mb-4">Rate this Restaurant</h2>

    <div class="mb-4">
      <label class="block mb-1 font-medium">Your Rating:</label>
      <div class="flex items-center space-x-2">
        <span
          v-for="star in 5"
          :key="star"
          class="text-3xl cursor-pointer"
          @click="rating = star"
          :class="{'text-yellow-400': star <= rating, 'text-gray-300': star > rating}"
        >★</span>
      </div>
    </div>

    <div class="mb-4">
      <label for="review" class="block mb-1 font-medium">Your Review:</label>
      <textarea
        id="review"
        v-model="review"
        class="w-full p-2 border rounded-lg"
        rows="4"
        placeholder="Share your thoughts about the restaurant..."
      ></textarea>
    </div>

    <div v-if="!submitted">
      <button
        @click="submitReview"
        :disabled="rating === 0 || review.trim() === ''"
        class="bg-green-600 text-white px-6 py-2 rounded-lg disabled:bg-gray-300"
      >
        Submit Review
      </button>
    </div>

    <div v-if="submitted" class="mt-4 text-green-700 font-medium">
      Thank you! Your review has been submitted.
    </div>
  </div>
</template>

<script>
export default {
  name: 'RateRestaurant',
  data() {
    return {
      rating: 0,
      review: '',
      submitted: false,
    }
  },
  methods: {
    submitReview() {
      console.log('Rating:', this.rating)
      console.log('Review:', this.review)
      // Here, you'd send the data to your API/backend
      this.submitted = true
    }
  }
}
</script>

<style scoped>
textarea:focus {
  outline: none;
  border-color: #4ade80; /* Tailwind green-400 */
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.3);
}
</style>
