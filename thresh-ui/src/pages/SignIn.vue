<!--Created by Isaac Philo for UC16: Log into account-->
<!-- This page allows any user to log into their account, given either their username or email and their password -->
<!-- When the user clicks sign -->

<template>
<body>
<div class="rounded outline-1 h-min w-full justify-center align-center text-center">  
  <div><h1 class = "text-xl py-2 font-semibold">Sign In</h1></div>
  <div class="outline-1">
  <div class="py-2">
    <p>Username or Email</p>
    <input for="usernameEmail" id = "usernameEmailInput" type="text" class="outline-1" v-model = "usernameEmail">
  </div>
  
  <div class="py-2">
    <p>Password</p>
    <input for="password" id = "passwordInput" type="password" class="outline-1 mb-3" v-model = "password">
  </div>
  </div>
  <div class="mt-2 mb-2">
    <button id = "signIn" class="my-2 py-0.5 px-2 rounded outline-2" @click = "login"> Sign in </button>
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
  data() {
    return {
      usernameEmail: "", //can be either
      password: "",
    };
  },
  methods: {
    //Send the login request to the backend.
    async login(){
      //Check for exceptional inputs
      if(this.password.length === 0){
        alert("Please enter a password.");
        return;
      }
      if(this.usernameEmail.length == 0){
        alert("Please enter a username.");
        return;
      }
      //Construct the request
      const headers = new Headers();
      headers.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        "usernameEmail": this.usernameEmail,
        "password": this.password,
      });

      const requestOptions = {
        method: "POST",
        headers: headers,
        body: raw,
      };
      //Send the request
      try{
        let response = await fetch("http://localhost:3000/api/login", requestOptions).then(response => response.json());
        console.log(response);
        if (!response || response.error) {
          throw response?.error
        }
        //Attempt to store the returned session cookie
        this.$cookies.set("session", response.sessionToken);
        console.log("Successful Login!");
        console.log(`local session cookie = ${this.$cookies.get("session")}`);
        this.sessionToken = response.sessionToken;
        alert(`Welcome, ${this.usernameEmail}!`);
        location.hash = "/filter-search"
      }
      catch (error){
        console.error(error);
        alert(error || "Login failed.");
      }
    }
  }
}
</script>