<!-- Made by Isaac Philo. This is a simple user profile. -->

<template>
  <div class="flex flex-col justify-center items-center">
    <div class="text-xl py-30 block mb-5">Welcome, <b>{{username}}</b>!</div>
    <div><img class="size-40" src = "./../assets/profile.png"></div>
    <a
      href="#/save-favorite-restaurant"
      class="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
    >
      Favorite Restaurants
    </a>
    <a
      href="#/delete-account"
      class="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
    >
      Account Settings
    </a>
  </div>
</template>

<script>
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

export default {
  name: 'Profile',
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
        let response = await fetch("http://localhost:3000/api/whoami", requestOptions).then(response => response.json());
        let username = response?.user?.username;
        if (username) {
          return username;
        }
        else {
          return "anonymous user";
        }
      }
      catch (error){
        console.error(error);
        return "anonymous user";
      }
    }
  }
}
</script>
