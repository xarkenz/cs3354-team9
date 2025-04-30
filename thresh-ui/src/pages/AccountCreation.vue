<template>
  <div class="flex min-h-screen">
    <!-- Left image -->
    <div class="flex-1 bg-[#606C38] flex justify-center items-center">
      <!-- <img src="../assets/corn.png" alt="Corn" class="max-w-md w-full" /> -->
       <!-- <img src="../assets/collage1.png" alt="food-collage" class="max-w-3xl w-full" /> -->
      <!-- Background Spline iframe -->
      <iframe
          src="https://my.spline.design/burger-sYsg97qHhDhNM34udRjufQGq/"
          frameborder="0"
          class="w-full h-full justify-center"
          allowfullscreen
        ></iframe>
    </div>

    <!-- absolute top-0 left-0 w-full h-full object-cover pointer-events-none opacity-30 -->
    <!-- Right signup form -->
    <div class="flex-1 bg-[#606C38] flex items-center justify-center">
      <form @submit.prevent="createAccount" class="w-full max-w-md px-8 py-10">
        <h2 class="text-white text-4xl font-bold mb-8">Sign Up</h2>

        <!-- Email Input -->
        <label class="block mb-4">
          <span class="block text-white font-medium mb-1">Email</span>
          <div class="flex items-center bg-gray-100 px-4 py-2 rounded-md">
            <svg class="w-5 h-5 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.94 6.33A2 2 0 014.83 5h10.34a2 2 0 011.89 1.33L10 11.01 2.94 6.33z"></path>
              <path d="M18 8.67V14a2 2 0 01-2 2H4a2 2 0 01-2-2V8.67l8 5.34 8-5.34z"></path>
            </svg>
            <input
              v-model="email"
              type="email"
              placeholder="your@email.com"
              class="w-full bg-transparent outline-none text-sm"
            />
          </div>
        </label>

        <!-- Username Input -->
        <label class="block mb-4">
          <span class="block text-white font-medium mb-1">Username</span>
          <div class="flex items-center bg-gray-100 px-4 py-2 rounded-md">
            <svg class="w-5 h-5 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm0 2c-4 0-6 2-6 4v1h12v-1c0-2-2-4-6-4z" />
            </svg>
            <input
              v-model="username"
              type="text"
              placeholder="username"
              class="w-full bg-transparent outline-none text-sm"
            />
          </div>
        </label>

        <!-- Password -->
        <label class="block mb-4">
          <span class="block text-white font-medium mb-1">Password</span>
          <div class="flex items-center bg-gray-100 px-4 py-2 rounded-md">
            <svg class="w-5 h-5 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5 9V7a5 5 0 1110 0v2h1a2 2 0 012 2v5a2 2 0 01-2 2H4a2 2 0 01-2-2v-5a2 2 0 012-2h1zm2-2a3 3 0 016 0v2H7V7z" clip-rule="evenodd" />
            </svg>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              class="w-full bg-transparent outline-none text-sm"
            />
          </div>
        </label>

        <!-- Confirm Password -->
        <label class="block mb-6">
          <span class="block text-white font-medium mb-1">Confirm Password</span>
          <div class="flex items-center bg-gray-100 px-4 py-2 rounded-md">
            <svg class="w-5 h-5 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5 9V7a5 5 0 1110 0v2h1a2 2 0 012 2v5a2 2 0 01-2 2H4a2 2 0 01-2-2v-5a2 2 0 012-2h1zm2-2a3 3 0 016 0v2H7V7z" clip-rule="evenodd" />
            </svg>
            <input
              v-model="confirmationPassword"
              type="password"
              placeholder="••••••••"
              class="w-full bg-transparent outline-none text-sm"
            />
          </div>
        </label>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full bg-[#283618] text-white py-3 rounded-md hover:bg-[#1f2615] transition"
        >
          Register
        </button>

        <div class="flex gap-2 items-center justify-center my-2">
        <p class="text-slate-200 font-semibold text-md">Already have an account?</p>
        <a class="font-semibold text-orange-300" href="#/sign-in">
          Sign In to Thresh.
        </a>
      </div>

      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AccountCreation',
  data() {
    return {
      email: "",
      username: "",
      password: "",
      confirmationPassword: "",
      sessionToken: "",  // you also used this but didn't define it
    };
  },
  methods: {
    async createAccount() {
      if (!this.email || !this.username || !this.password || !this.confirmationPassword) {
        alert("Please complete all fields.");
        return;
      }
      if (this.password !== this.confirmationPassword) {
        alert("Passwords do not match.");
        return;
      }

      const raw = JSON.stringify({
        email: this.email,
        username: this.username,
        password: this.password,
        confirmationPassword: this.confirmationPassword,
      });

      try {
        const data = await fetch("/api/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: raw,
        }).then(response => response.json());
        console.log(data);
        if (!data || data.error) {
          throw data?.error
        }

        // Store cookies
        this.$cookies.set("session", data.sessionToken);
        console.log(`sessionToken = ${data.sessionToken}`);
        console.log(`session=${this.$cookies.get("session")}`);

        this.sessionToken = data.sessionToken;
        sessionStorage.setItem("userID", data.userID);
        console.log(`global variable this.sessionToken = ${this.sessionToken}`);

        alert("Account created!");
        location.hash = "/filter-search";
      } catch (error) {
        console.error(error);
        alert(`Failed to create account: ${error}`);
      }
    },
  },
};
</script>