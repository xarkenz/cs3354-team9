<!-- Made by Isaac Philo. This is a simple user profile. -->
import { useNavigate } from 'react-router-dom';

<template>
  <div class="flex flex-col justify-center items-center">
    <div class="text-xl py-30 block mb-5 underline">Welcome, {{username}}!</div>
    <div><img class="size-40" src = "./../assets/profile.png"></div>
    <button
      @click="goToFavorite"
      class="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
    >
      Go to Favorite Page
      navigate('/filter-search');
    </button>
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
