<!--Created by Eliza Heasley for UC13: Ban User-->

<template>
    <div class="rounded outline-1 h-min w-full">
        <div>
            <h1 class="text-xl py-2 font-semibold">User Profile: {{userName}}</h1>
        </div>
        <p>User's Comments:</p>
        <p>User has no comments.</p>
        <div class="mt-2">
            <button id="banUser" @click="banUser" class="my-2 py-0.5 px-2 rounded outline-2"> Ban User </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BanUser',
    data: () => ({
        userId: 'exampleuser',
        userName: 'Example User',
    }),
    methods: {
        banUser(e) {
            e.preventDefault();
            alert("User banned!");
        }
    }
}
</script>
