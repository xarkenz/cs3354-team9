<!--Created by Isaac Philo for UC16: Log into account-->

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
  <div class="mt-2">
    <button id = "signIn" class="my-2 py-0.5 px-2 rounded outline-2" @click = "login"> Sign in </button>
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
  data() {
    return {
      usernameEmail: "", //can be either
      password: "",
    };
  },
  methods: {
    async login(){
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
      try{
        let response = await fetch("http://localhost:3000/api/login", requestOptions);
        let body = JSON.parse(await response.text());
        console.log(body);
        this.$cookies.set("session", body.sessionToken);
        console.log("Successful Login!");
        console.log(`returned sessionToken = ${body.sessionToken}`);
        console.log(`local session cookie =${this.$cookies.get("session")}`);
        this.sessionToken = body.sessionToken;
        console.log(`global variable this.sessionToken = ${this.sessionToken}`);
      }
      catch (error){
        console.log(error);
      }
    }
  }
}
</script>