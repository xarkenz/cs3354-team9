<template>
<body>
<div>  
  <div><h1>Create an account</h1></div>
  <div>
  <div>
    <p>Email</p>
    <input for="email" id = "emailInput" type="email">
  </div>
  
  <div>
    <p>Password</p>
    <input for="password" id = "passwordInput" type="password">
  </div>

  <div>
    <button id = "register"> Register </button>
  </div>

  <div><button id = "signUpGoogle">Sign up with Google</button></div>
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