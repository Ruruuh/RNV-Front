<script setup lang="ts">
    import { ref } from "vue"
    import { useUserStore } from "@/stores/user"
    import { useRouter } from "vue-router"
    import type { UserResponse } from "@/types"
    import nprogress from "nprogress"

    const store = useUserStore()
    const router = useRouter()

    const email = ref("")
    const password = ref("")
    const doesEmailExist = ref(false)
    const doesPasswordMatch = ref(false)

    function goBack() {
        router.go(-1)
    }

    function updateDoesEmailExist(status: boolean) {
        doesEmailExist.value = status
    }

    function updateDoesPasswordMatch(status: boolean) {
        doesPasswordMatch.value = status
    }

    async function login() {
        nprogress.start()
        updateDoesEmailExist(false)
        updateDoesPasswordMatch(false)

        const payload = {
            email: email.value,
            password: password.value
        }

        const response: UserResponse | undefined = await store.login(payload)

        if (response) {
            if (response.message?.includes("User")) {
                updateDoesEmailExist(true)
                nprogress.done()
                return
            } else if (response.message?.includes("Password")) {
                updateDoesPasswordMatch(true)
                nprogress.done()
                return
            }
        }

        email.value = ""
        password.value = ""

        nprogress.done()
        router.push("home")
    }
</script>

<template>
    <section class="login">
        <div @click="goBack" class="login__back">
            <div class="login__back-icon"></div>
            <div class="login__back-copy">go back</div>
        </div>
        <div class="login__header">Login.</div>
        <form @submit.prevent="login" class="login__form">
            <input type="text" placeholder="Email" v-model="email" required />
            <div v-if="doesEmailExist" class="error">Email does not exist. Please register.</div>
            <input type="password" placeholder="Password" v-model="password" required />
            <div v-if="doesPasswordMatch" class="error">Password did not match the email used. Please try again.</div>
            <base-button type="submit" mode="dark">Login</base-button>
        </form>
    </section>
</template>

<style scoped>
    .login {
        padding: 3rem 0rem;
        width: 513.25px;
    }
    .login__header {
        font-size: 5rem;
        font-weight: 700;
        letter-spacing: 2px;
    }
    .login__form {
        display: flex;
        flex-direction: column;
        margin: 0.8rem 0.3rem;
    }
    input {
        font: inherit;
        padding: 0.2rem;
        margin: 0.5rem 0rem;

    }
    .login__back {
        cursor: pointer;
        display: flex;
        align-items: center;
    }
    .login__back-icon {
        background-image: url('../assets/back.svg');
        background-size: cover;
        width: 1.5rem;
        height: 1.5rem;
    }
    .error {
        font-size: 0.8rem;
        color: var(--red-800);
    }
</style>