<!--
Created by Sean Clarke for UC17: Delete Own Account
-->

<template>
  <div class="p-10">
    <div v-if="showFinishMessage" class="text-center text-lg">
      <p>Your account has been deleted. Thank you for using Thresh!</p>
      <p><a href="#/" class="underline">Return to homepage</a></p>
    </div>
    <div v-else class="w-fit mx-auto">
      <div class="text-center mb-10">
        <h2 class="text-2xl font-semibold">Account Settings</h2>
        <a href="#/profile" class="text-lime-700">← Return to profile</a>
      </div>
      <div class="text-center mb-10">
        <label class="block my-2">Language</label>
        <select v-model="selectedLanguage" class="px-4 py-2 rounded-lg border-2 border-slate-300">
          <option value="en" selected>English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
        </select>
      </div>
      <div class="text-center mb-10">
        <label class="block my-2">Email Address</label>
        <input
          type="email"
          v-model="newEmail"
          :placeholder="currentUser?.email || 'your@email.com'"
          class="px-4 py-2 rounded-lg border-2 border-slate-300"
        ></input>
        <button
          @click="updateEmail"
          :disabled="newEmail === ''"
          class="ml-2 px-4 py-2 rounded-lg border-2 border-lime-700 disabled:border-slate-300 bg-lime-700 disabled:bg-transparent font-semibold text-white disabled:text-slate-300"
        >
          Update
        </button>
      </div>
      <div v-if="showConfirmMessage" class="w-fit mx-auto my-4 px-4 rounded-lg border-2 border-red-500">
        <p class="text-lg text-red-600"><strong>Are you sure you want to delete your account?</strong></p>
        <p>All of your account data will be deleted, including:</p>
        <ul>
          <li>Account history and preferences</li>
          <li>Dietary profiles</li>
          <li>Restaurant reviews</li>
        </ul>
        <p><strong>This action cannot be undone!</strong></p>
        <p><label class="italic">
          <input v-model="acknowledged" type="checkbox" class="mx-2">
          I acknowledge the consequences and wish to proceed.
        </label></p>
      </div>
      <div class="w-fit mx-auto">
        <button
          @click="requestAccountDeletion"
          :disabled="showConfirmMessage && !acknowledged"
          class="px-4 py-2 rounded-lg border-2 border-red-500 disabled:border-slate-300 bg-red-500 disabled:bg-transparent font-semibold text-white disabled:text-slate-300"
        >
          Delete Account
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

export default {
  name: "DeleteAccount",
  props: ["currentUser"],

  data() {
    return {
      selectedLanguage: "en",
      newEmail: "",
      showConfirmMessage: false,
      acknowledged: false,
      showFinishMessage: false,
    }
  },

  methods: {
    async updateEmail() {
      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "mycookies": document.cookie,
        },
        body: JSON.stringify({
          email: this.newEmail,
        }),
      }

      let response = await fetch("/api/account", requestOptions).then(response => response.json())

      if (!response || response.error) {
        console.error(response)
        alert("Failed to update email address: " + response?.error)
      }
      else {
        alert("Email address successfully updated.")
        this.newEmail = ""
      }
    },

    async requestAccountDeletion() {
      if (!this.showConfirmMessage) {
        // First time: show confirmation message
        this.showConfirmMessage = true
      }
      else if (this.acknowledged) {
        // Second time: actually delete the account
        if (await this.deleteAccount()) {
          this.showConfirmMessage = false
          this.showFinishMessage = true
        }
      }
    },

    async deleteAccount() {
      const requestOptions = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "mycookies": document.cookie,
        },
      }

      let response = await fetch("/api/account", requestOptions).then(response => response.json())

      if (!response || response.error) {
        console.error(response)
        alert("Failed to delete account: " + response?.error)
        return false
      }
      else {
        return true
      }
    },
  },
}
</script>

<style scoped>
p, ul {
  margin-block: 1rem;
}

ul li::before {
  content: "•";
  margin-inline: 1rem;
}
</style>
