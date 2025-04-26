<!--Created by Eliza Heasley for UC13: Ban User-->

<template>
    <div class="flex flex-col justify-center items-center gap-5">
        <template v-if="loading">
            <h1 class="text-xl py-2 font-semibold">Loading...</h1></template>
        <template v-else-if="user">
            <h1 class="text-xl py-2 font-semibold">User Profile: {{user.username}}</h1>
            <p>User's Reviews:</p>
            <p>User has no reviews.</p>
            <div v-if="user.canBan" class="mt-2">
                <button id="banUser" @click="banUser" class="my-2 py-0.5 px-2 rounded outline-2">Ban User</button>
            </div>
        </template>
        <template v-else>
            <h1 class="text-xl py-2 font-semibold">User not found!!</h1>
        </template>
    </div>
</template>

<script>
export default {
    name: 'User',
    data: () => ({
        user: null,
        loading: true,
    }),
    async mounted() {
        await this.fetchUser();
    },
    methods: {
        async fetchUser() {
            this.loading = true;
            const username = window.location.hash.match(/^#\/?(?:[^/]*\/)?([^/]*)/)[1];
            //Construct the request
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("mycookies", `session=${this.$cookies.get('session')}`);

            const requestOptions = {
                method: "GET",
                headers: headers,
            };
            const res = await fetch(`/api/user/${username}`, requestOptions);
            if(res.status == 200)
                this.user = await res.json();
            else
                this.user = null;
            this.loading = false;
        },
        async banUser() {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("mycookies", `session=${this.$cookies.get('session')}`);
            const requestOptions = {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    username: this.user.username,
                }),
            };
            const res = await fetch(`/api/ban-user`, requestOptions);
            if(res.status == 200)
                alert('User banned!');
            else
                alert('Ban failed!');
            this.fetchUser();
        }
    },
}
</script>
