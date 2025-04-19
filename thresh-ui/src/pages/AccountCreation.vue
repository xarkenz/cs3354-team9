<!--Created by Isaac Philo for UC01: Make an account.-->

<template>
<body>
<div class="rounded outline-1 h-min w-full justify-center align-center text-center">  
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

    <div class="mb-2">
      <button id = "registerGoogle" class="my-2 py-0.5 px-2 rounded outline-2">Sign up with Google</button>
    </div>
  </form>
</div>
</body>
</template>

<script>
// Author: Isaac Philo
// This code is for UC01: Make an account.
// It allows a user to create an account with an email and password.

import { useCookies } from "vue3-cookies";

export default {
  // setup() { //based on https://github.com/KanHarI/vue3-cookies/blob/master/README.md
  //   const { cookies } = useCookies();
  //   return { cookies };
  // },
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
    async createAccount(){
      event.preventDefault();
      if(this.password !== this.confirmationPassword){
        console.log("Error! Passwords do not match!");
      }
      else{
        // let port = 3000; //CAUTION: Currently assuming local deployment
        // let fetchUrl = `http://localhost:${port}/api/signup`;
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        // headers.append("Cookie", `session=${session}`);

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
          // redirect: "follow"
        };
        try{
          let response = await fetch("http://localhost:3000/api/signup", requestOptions);
          let body = JSON.parse(await response.text());
          console.log(body);
          //The $cookies variable is a global cookies variable defined in main.js from the vue3-cookies import
          this.$cookies.set("session", body.sessionToken);
          console.log(`sessionToken = ${body.sessionToken}`);
          console.log(`session=${this.$cookies.get("session")}`);
          this.sessionToken = body.sessionToken;
          console.log(`global variable this.sessionToken = ${this.sessionToken}`);
        }
        catch (error){
          console.log(error);
        }
      }
    }
  }
}
</script>