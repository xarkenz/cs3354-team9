<!--Created by Isaac Philo for UC01: Make an account.-->
<!--Given an email, username, password, and confirmation password,
    this page allows the user to create an account which is
    registered with the database on the backend.
 -->

<template>
<body>
<div class="rounded outline-1 h-min w-full justify-center align-center text-center">
  <!-- The form for entering account creation information -->
  <form @submit.stop.prevent="createAccount">
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
      <input for="password" id = "passwordInput" type="password" class="outline-1" v-model="password">
    </div>
    <div class="py-4">
      <p>Confirm password</p>
      <input for="password" id = "confirmationPasswordInput" type="password" class="outline-1 mb-4" v-model="confirmationPassword">
    </div>
    </div>
    <div class="mt-2">
      <button id = "register" class="my-2 py-0.5 px-2 rounded outline-2" type="submit"> Register </button> 
    </div>
  </form>
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
      confirmationPassword: "",
    };
  },
  methods: {
    //This method uses the v-model variables to create an account in the database
    //and stores the cookies for the created account in the browser.
    async createAccount(event){
      event.preventDefault();
      //Check exceptional inputs
      if(this.email.length === 0){
        alert("Please enter an email.");
        return;
      }
      if(this.username.length === 0){
        alert("Please enter a username.");
        return;
      }
      if(this.password.length === 0 && this.confirmationPassword.length === 0){
        alert("Please enter a password and a confirmation password.");
        return;
      }
      if(this.password.length === 0){
        alert("Please enter a password.");
        return;
      }
      if(this.confirmationPassword.length === 0){
        alert("Please enter a confirmation password.");
        return;
      }
      //Check an invalid input
      if(this.password !== this.confirmationPassword){
        alert("Password and confirmation password do not match.");
        return;
      }
      else{
        //Construct a request
        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        const raw = JSON.stringify({
          "email": this.email,
          "username": this.username,
          "password": this.password,
          "confirmationPassword": this.confirmationPassword,
        });

        const requestOptions = {
          method: "POST",
          headers: headers,
          body: raw,
        };
        //Send the request
        try{
          let response = await fetch("http://localhost:3000/api/signup", requestOptions).then(response => response.json());
          console.log(response);
          //The $cookies variable is a global cookies variable defined in main.js from the vue3-cookies import
          //Store the cookies
          this.$cookies.set("session", response.sessionToken);
          console.log(`sessionToken = ${response.sessionToken}`);
          console.log(`session=${this.$cookies.get("session")}`);
          this.sessionToken = response.sessionToken;
          console.log(`global variable this.sessionToken = ${this.sessionToken}`);
          alert("Account created!");
          location.hash = "/filter-search"
        }
        catch (error){
          console.log(error);
        }
      }
    }
  }
}
</script>