<template>
  <!-- Dark overlay -->
  <div
    class="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center"
    @click.self="$emit('close')"
  >
    <!-- Modal container -->
    <div class="bg-white w-[95%] max-w-xl rounded-xl shadow-lg p-6 relative">
      <!-- Close button -->
      <button
        class="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl font-bold"
        @click="$emit('close')"
        aria-label="Close"
      >
        &times;
      </button>

      <!-- Title -->
      <h2 class="text-2xl font-bold mb-4 text-center text-green-950">Rate this Restaurant</h2>

      <!-- Review Title input -->
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
            :class="{
              'text-yellow-400': star <= rating,
              'text-gray-300': star > rating
            }"
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
          class="bg-lime-700 hover:bg-green-950 text-white px-6 py-2 rounded-lg w-full"
        >
          Submit Review
        </button>

      </div>

      <!-- Success Toast -->
      <div
        v-show="submitted"
        class="fixed top-1/7 left-1/2 transform -translate-x-1/4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-[9999] transition-opacity duration-6000"
        :class="{ 'opacity-100': submitted }"
      >
        Thank you! Your review has been submitted!
      </div>

      <!-- Error Toast -->
      <div
        v-show="showError"
        class="fixed top-1/7 left-1/2 transform -translate-x-1/4 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-[9999] transition-opacity duration-300"
        :class="{ 'opacity-100': showError }"
      >
        {{ errorMessage }}
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'RateRestaurant',
  props: {
    place: {
      type: Object,
      required: true
    }
  },
  emits: ['close', 'submitted'],
  data() {
    return {
      rating: 0,
      title: '',
      review: '',
      submitted: false,
      errorMessage: '',
      showError: false,
    };
  },
  mounted() {
    const userId = sessionStorage.getItem("userID");
    if (!userId) {
      alert('You must be logged in to rate a restaurant.');
      this.$emit('close');
      return;
    }

    // this.authorID = parseInt(userId);
    // console.log('Author ID set to:', this.authorID);
  },
  methods: {
    async submitReview() {
      if (this.rating === 0) {
        this.errorMessage = 'Please select a star rating.';
        console.log("can't submit without rating")
        this.triggerErrorToast();
        return;
      }
      if (this.title.trim() === '') {
        this.errorMessage = 'Please enter a review title.';
        this.triggerErrorToast();
        return;
      }
      if (this.review.trim() === '') {
        this.errorMessage = 'Please enter your review text.';
        this.triggerErrorToast();
        return;
      }


  try {
    const response = await fetch('http://localhost:3000/api/reviews', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'mycookies': document.cookie
      },
      body: JSON.stringify({
        businessID: this.place.id,
        title: this.title.trim(),
        content: this.review.trim(),
        numStars: this.rating,
      }),
    });

    if (!response.ok) throw new Error('Failed to submit review');
    

    this.submitted = true;
    console.log("Submitted set to true");

    await this.$nextTick();

    setTimeout(() => {
      this.submitted = false;
      this.rating = 0;
      this.title = '';
      this.review = '';
      this.$emit('submitted');
      this.$emit('close');
    }, 1000);
  } catch (err) {
    console.error(err);
    alert('Failed to submit review.');
  }
},

triggerErrorToast() {
  this.showError = true;
  setTimeout(() => {
    this.showError = false;
  }, 3000);
}


  },
};
</script>



<style scoped>
textarea:focus,
input:focus {
  outline: none;
  border-color: #4ade80; /* Tailwind green-400 */
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.3);
}

.opacity-100 {
  opacity: 1 !important;
}

</style>
