<!--Created by Isaac Philo for UC16: Log into account-->

<template>
<body>
<div class="rounded outline-1 h-min w-full justify-center align-center text-center">  
  <div><h1 class = "text-xl py-2 font-semibold">Sign In</h1></div>
  <div class="outline-1">
  <div class="py-2">
    <p>Email or Username</p>
    <input for="emailUsername" id = "emailUsernameInput" type="text" class="outline-1">
  </div>
  
  <div class="py-2">
    <p>Password</p>
    <input for="password" id = "passwordInput" type="password" class="outline-1 mb-3">
  </div>
  </div>
  <div class="mt-2">
    <button id = "signIn" class="my-2 py-0.5 px-2 rounded outline-2"> Sign in </button>
  </div>

  <div class="mb-2">
    <button id = "signInGoogle" class="my-2 py-0.5 px-2 rounded outline-2">Sign in with Google</button>
  </div>
</div>
</body>
</template>

<script>
// Author: Isaac Philo
// This code is for UC16: Log into account.
// It allows a user to log into their account with an email or username paired with a password.
export default {
  name: 'SignIn',
}
</script>