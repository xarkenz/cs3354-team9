<!--
Created by Sarah Jacob for UC08: Rate a Restaurant
-->

<template>
  <div class="max-w-xl mx-auto my-8 p-6 rounded-xl shadow-lg bg-white border border-gray-200">
    <h2 class="text-2xl font-bold mb-4">Rate this Restaurant</h2>

    <!-- Title input -->
    <div class="mb-4">
      <label for="title" class="block mb-1 font-medium">Review Title:</label>
      <input
        id="title"
        v-model="title"
        class="w-full p-2 border rounded-lg"
        placeholder="e.g. Amazing vegan options!"
      />
    </div>

    <!-- Star rating -->
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

    <!-- Review textarea -->
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

    <!-- Submit button -->
    <div v-if="!submitted">
      <button
        @click="submitReview"
        :disabled="rating === 0 || title.trim() === '' || review.trim() === ''"
        class="bg-green-600 text-white px-6 py-2 rounded-lg disabled:bg-gray-300"
      >
        Submit Review
      </button>
    </div>

    <!-- Success message -->
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
      title: '',
      review: '',
      submitted: false,
      businessID: null,
      authorID: 1, // DUMMY USER
    };
  },
  created() {
  const hash = window.location.hash; // e.g., "#/rate-restaurant/3"
  const segments = hash.split('/');
  if (segments.length >= 3 && segments[1] === 'rate-restaurant') {
    this.businessID = parseInt(segments[2]);
  } else {
    console.error('Invalid hash format. Could not extract businessID.');
  }
  this.authorID = 1; // Dummy user
},
  methods: {
    async submitReview() {
      if (!this.rating || !this.review.trim() || !this.title.trim()) return;

      try {
        const response = await fetch('http://localhost:3000/api/reviews', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            businessID: this.businessID,
            authorID: this.authorID,
            title: this.title.trim(),
            content: this.review.trim(),
            numStars: this.rating,
          }),
        });

        if (!response.ok) throw new Error('Failed to submit review');

        this.submitted = true;
        this.rating = 0;
        this.title = '';
        this.review = '';
      } catch (err) {
        console.error(err);
        alert('Failed to submit review.');
      }
    },
  },
};
</script>

<style scoped>
textarea:focus {
  outline: none;
  border-color: #4ade80; /* Tailwind green-400 */
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.3);
}
</style>
