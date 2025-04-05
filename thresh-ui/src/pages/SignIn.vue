<!--Created by Isaac Philo for UC16: Log into account-->

<template>
<body>
<div class="rounded outline-1 h-min w-full justify-center align-center text-center">  
  <div><h1 class = "">Sign in</h1></div>
  <div class="outline-1">
  <div class="py-4">
    <p>Email or Username</p>
    <input for="emailUsername" id = "emailUsernameInput" type="text" class="outline-1">
  </div>
  
  <div class="py-4">
    <p>Password</p>
    <input for="password" id = "passwordInput" type="password" class="outline-1">
  </div>
  </div>
  <div>
    <button id = "signIn" class="py-4"> Sign in </button>
  </div>

  <div><button id = "signInGoogle" class="py-4">Sign in with Google</button></div>
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