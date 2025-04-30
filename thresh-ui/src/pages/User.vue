<!--Created by Eliza Heasley for UC13: Ban User-->

<template>
    <div class="min-h-screen bg-[#606C38] py-12 px-4 flex justify-center items-center">
        <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
            <template v-if="loading">
                <h1 class="text-xl py-2 font-semibold">Loading...</h1></template>
            <template v-else-if="user">
                <!-- Profile + Welcome Message -->
                <div class="flex items-center gap-4">
                <img class="w-24 h-24 rounded-full object-cover" src="../assets/profile.png" alt="Profile" />
                <div>
                    <h2 class="text-[#283618] text-lg">User Profile:</h2>
                    <p class="text-[#283618] text-2xl font-bold">{{user.username}}</p>
                </div>
                </div>
                <div class="relative">
                    <!-- Modal Header -->
                    <div class="flex items-center gap-3 mb-6">
                        <h2 class="text-xl font-semibold text-[#283618]">{{user.username}}’s Reviews</h2>
                    </div>
                    <!-- Review List -->
                    <div v-if="user.reviews.length" class="space-y-4">
                        <div
                            v-for="review in user.reviews"
                            :key="review.id"
                            class="bg-[#DDE2E4] rounded-md p-4 shadow-sm"
                        >
                            <h3 class="text-lg font-bold text-[#283618]">{{review.business.name}}</h3>
                            <div class="flex items-center text-sm text-gray-500 mb-1">
                                <span v-for="n in review.numStars" :key="n" class="text-yellow-500">★</span>
                                <span v-for="n in (5 - review.numStars)" :key="'empty' + n" class="text-gray-300">★</span>
                            </div>
                            <p class="text-gray-800">{{ review.content }}</p>
                        </div>
                    </div>
                    <div v-else class="text-center text-gray-500">No reviews yet.</div>
                </div>
                <div v-if="user.canBan" class="mt-2">
                    <button id="banUser" @click="banUser" class="mt-6 w-full py-2 rounded-md bg-white font-bold bg-[#914F3B] hover:bg-[#662713] text-white transition">Ban User</button>
                </div>
            </template>
            <template v-else>
                <h1 class="text-xl py-2 font-semibold">User not found!!</h1>
            </template>
        </div>
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
