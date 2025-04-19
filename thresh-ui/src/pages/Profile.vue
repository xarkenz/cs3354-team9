<template>
  <div class="text-center">
    <div class="text-xl py-30 block mb-5 underline">Welcome, {{username}}!</div>
    
  </div>
</template>

<script>
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

export default {
  name: 'Home',
  asyncComputed: {
    async username(){
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("mycookies", `session=${cookies.get("session")}`);

        const requestOptions = {
          method: "GET",
          headers: headers,
        };
        try{
          let response = await fetch("http://localhost:3000/api/whoami", requestOptions);
          let username = JSON.parse(await response.text())[0]?.username;
          console.log("Fetched username: " + username);
          if(username.length === 0){
            return "anonymous user";
          }
          else{
            return username;
          }
        }
        catch (error){
          console.log(error);
          return "anonymous user";
        }
    }
  }
}
</script>
