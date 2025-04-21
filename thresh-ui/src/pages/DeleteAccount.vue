<!--
Created by Sean Clarke for UC17: Delete Own Account
-->

<template>
  <div>
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
    <div v-if="!showFinishMessage" class="w-fit mx-auto">
      <button
        @click="requestAccountDeletion"
        :disabled="showConfirmMessage && !acknowledged"
        class="px-8 py-3 rounded-xl border-2 border-red-500 disabled:border-slate-300 bg-red-500 disabled:bg-transparent font-bold text-white disabled:text-slate-300"
      >
        Delete Account
      </button>
    </div>
    <div v-if="showFinishMessage" class="text-center">
      <p class="text-lg">Your account has been deleted. Thank you for using Thresh!</p>
      <p class="text-lg">
        <a href="#/" class="underline">Return to homepage</a>
      </p>
    </div>
  </div>
</template>

<script>
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

export default {
  name: 'DeleteAccount',

  data() {
    return {
      showConfirmMessage: false,
      acknowledged: false,
      showFinishMessage: false,
    }
  },

  methods: {
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
      const headers = new Headers()
      headers.append("Content-Type", "application/json")
      headers.append("mycookies", `session=${cookies.get("session")}`)

      const requestOptions = {
        method: "DELETE",
        headers: headers,
      }

      let response = await fetch("http://localhost:3000/api/account", requestOptions).then(response => response.json())

      if (!response || response.error) {
        console.error(response)
        alert("Failed to delete account: " + response?.error)
        return false
      }
      else {
        console.log(response)
        return true
      }
    }
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
