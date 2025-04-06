<!--Created by Isaac Philo for UC01: Make an account.-->

<template>
<body>
<div class="rounded outline-1 h-min w-full justify-center align-center text-center">  
  <div><h1 class = "text-xl py-2 font-semibold">Sign Up</h1></div>
  <div class="outline-1">
  <div class="py-4">
    <p>Email</p>
    <input for="email" id = "emailInput" type="email" class="outline-1" v-model="email">
  </div>
  <div class="py-4">
    <p>Username</p>
    <input for="username" id = "usernameInput" type="text" class="outline-1" v-model="username">
  </div>
  <div class="py-4">
    <p>Password</p>
    <input for="password" id = "passwordInput" type="password" class="outline-1 mb-4" v-model="password">
  </div>
  </div>
  <div class="mt-2">
    <button id = "register" class="my-2 py-0.5 px-2 rounded outline-2"> Register </button>
  </div>

  <div class="mb-2">
    <button id = "registerGoogle" class="my-2 py-0.5 px-2 rounded outline-2">Sign up with Google</button>
  </div>
</div>
</body>
</template>

<script>
// Author: Isaac Philo
// This code is for UC01: Make an account.
// It allows a user to create an account with an email and password.
export default {
  name: 'AccountCreation',
  data() {
    return {
      email: "",
      username: "",
      password: "",
    };
  },
  methods: {
    createAccount(){
      
    }
  }
}
</script>