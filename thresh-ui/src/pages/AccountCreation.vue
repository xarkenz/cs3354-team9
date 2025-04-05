<template>
<body>
<div class="inline-block align-baseline">
  <div><h1>Create an account</h1></div>
  
  <div class="Interactive Parts">
  <div>
    <p>Email</p>
    <input for="email" id = "emailInput" type="email">
  </div>
  
  <div>
    <p>Password</p>
    <input for="password" id = "passwordInput" type="password">
  </div>

  <div>
    <button id = "signIn"> Sign in </button>
    <button id = "register"> Register </button>
  </div>

  <div><a>Forgot password?</a></div>

  <div><button id = "signInGoogle">Sign in with Google</button></div>
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
}
</script>