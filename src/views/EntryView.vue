<script setup lang="ts">
    import { useRouter } from 'vue-router'

    const router = useRouter()

    function goToRegister() {
        router.push('register')
    }

    function goToLogin() {
        router.push('login')
    }    
</script>

<template>
    <section class="entry">
        <div class="entry__header">Hello there.</div>
        <div class="entry__subheader">
            <div>Need something reimbursed?</div>
            <div>Let us help.</div>
        </div>
        <div class="entry__actions">
            <div class="entry__register">Register here to get started.</div>
            <base-button @click="goToRegister" mode="dark">Register</base-button>
            <div class="entry__login">Already have an account?</div>
            <base-button @click="goToLogin" mode="dark">Login</base-button>
        </div>
    </section>
</template>

<style scoped>
    .entry {
        padding: 3rem 0rem;
    }
    .entry__header {
        font-size: 5rem;
        font-weight: 700;
        letter-spacing: 2px;
    }
    .entry__subheader {
        font-size: 1.5rem;
        letter-spacing: 2px;
        padding: 0.3rem;
    }
    .entry__actions {
        padding: 0.3rem;
        margin: 2rem 0rem;
    }
    .entry__register,
    .entry__login {
        font-size: 1.2rem;
        margin: 0.8rem 0rem;
    }
</style>