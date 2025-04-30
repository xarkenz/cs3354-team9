<template>
  <div class="flex min-h-screen">
    <!-- Left image/graphic -->
    <div class="flex-1 bg-[#606C38] flex justify-center items-center">
      <img src="../assets/food3d.png" alt="Eggs and Broccoli" class="max-w-md w-full" />
    </div>

    <!-- Right login form -->
    <div class="flex-1 bg-[#606C38] flex items-center justify-center">
      <div class="w-full max-w-md px-8 py-10 bg-[#606C38]">
        <form @submit.prevent="login">
          <h2 class="text-white text-4xl font-bold mb-8">Sign In</h2>

          <!-- Email Input -->
          <label class="block mb-4">
            <span class="block text-white font-medium mb-1">Email</span>
            <div class="flex items-center bg-gray-100 px-4 py-2 rounded-md">
              <svg class="w-5 h-5 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.94 6.33A2 2 0 014.83 5h10.34a2 2 0 011.89 1.33L10 11.01 2.94 6.33z"></path>
                <path d="M18 8.67V14a2 2 0 01-2 2H4a2 2 0 01-2-2V8.67l8 5.34 8-5.34z"></path>
              </svg>
              <input
                v-model="usernameEmail"
                type="text"
                placeholder="your@email.com"
                class="w-full bg-transparent outline-none text-sm"
              />
            </div>
          </label>

          <!-- Password Input -->
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

          <!-- Forgot Password -->
          <div class="flex justify-end text-sm mb-6">
            <a href="#" class="text-gray-300 hover:text-white">Forgot password?</a>
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            class="w-full bg-[#283618] text-white py-3 rounded-md hover:bg-[#1f2615] transition"
          >
            Login
          </button>

          <!-- Divider -->
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SignIn',
  data() {
    return {
      usernameEmail: "",
      password: "",
    };
  },
  methods: {
    async login() {
      if (!this.usernameEmail || !this.password) {
        alert("Please enter both email and password.");
        return;
      }

      const headers = new Headers({ "Content-Type": "application/json" });
      const raw = JSON.stringify({
        usernameEmail: this.usernameEmail,
        password: this.password,
      });

      const requestOptions = {
        method: "POST",
        headers,
        body: raw,
      };
      //Send the request
      try{
        let response = await fetch("/api/login", requestOptions).then(response => response.json());
        console.log(response);
        if (!response || response.error) {
          throw response?.error
        }
        //Attempt to store the returned session cookie
        this.$cookies.set("session", response.sessionToken, { expires: null });
        sessionStorage.setItem("userID", response.userID);
        console.log("Successful Login!");
        console.log(`returned sessionToken = ${response.sessionToken}`);
        console.log(`local session cookie = ${this.$cookies.get("session")}`);
        this.sessionToken = response.sessionToken;
        console.log(`global variable this.sessionToken = ${this.sessionToken}`);
        alert(`Welcome, ${response.username}!`);
        location.hash = "/filter-search";
      } catch (error) {
        console.error(error);
        alert(error || "Login failed.");
      }
    }
  }
}
</script>
