<template>
<body>
<div class="rounded outline-1 h-140 w-1/2 justify-center align-center">  
  <div><h1 class = "">Sign in</h1></div>
  <div>
  <div>
    <p>Email or Username</p>
    <input for="emailUsername" id = "emailUsernameInput" type="text">
  </div>
  
  <div>
    <p>Password</p>
    <input for="password" id = "passwordInput" type="password">
  </div>

  <div>
    <button id = "signIn"> Sign in </button>
  </div>

  <div><button id = "signInGoogle">Sign in with Google</button></div>
  </div>
</div>
</body>
</template>

<script>
// Author: Isaac Philo
// This code is for UC16: Make an account.
// It allows a user to log into their account with an email or username paired with a password.
export default {
  name: 'SignIn',
}
</script>