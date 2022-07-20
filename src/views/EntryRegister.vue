<script setup lang="ts">
    import { ref } from "vue"
    import { useRouter } from "vue-router"
    import { useUserStore } from "@/stores/user"
    import nprogress from "nprogress"

    const router = useRouter()
    const store = useUserStore()

    const firstName = ref("")
    const lastName = ref("")
    const email = ref("")
    const password = ref("")
    const passwordCheck = ref("")
    const isPasswordSame = ref(true)
    const isEmailUnique = ref(true)

    function goBack() {
        router.go(-1)
    }

    function updateIsPasswordSame() {
        if (password.value !== passwordCheck.value) {
            isPasswordSame.value = false
        } else {
            isPasswordSame.value = true
        }
    }

    function updateIsEmailUnique(status: boolean) {
        isEmailUnique.value = status
    }

    async function register() {
        nprogress.start()
        if (password.value !== passwordCheck.value) {
            updateIsPasswordSame()
            nprogress.done()
            return
        }

        const payload = {
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            password: password.value,
            role: 'user',
            department: "NA",
        }

        const response = await store.register(payload)

        if (response) {
            if (response.message) {
                updateIsEmailUnique(false)
                return
            }
        }

        updateIsEmailUnique(true)

        firstName.value = "",
        lastName.value = "",
        email.value = "",
        password.value = "",
        passwordCheck.value = ""

        nprogress.done()
        router.push("home")
    }
</script>

<template>
    <section class="register">
        <div @click="goBack" class="register__back">
            <div class="register__back-icon"></div>
            <div class="register__back-copy">go back</div>
        </div>
        <div class="register__header">Register.</div>
        <form @submit.prevent="register" class="register__form">
            <input type="text" placeholder="First Name" v-model="firstName" required />
            <input type="text" placeholder="Last Name" v-model="lastName" required />
            <select class="register__office">
                <option value="">-- Please choose an office --</option>
                <option value="FEU Tech">FEU Tech</option>
                <option value="FEU Diliman">FEU Diliman</option>
                <option value="FEU Makati">FEU Makati</option>
                <option value="FEU Cavite">FEU Cavite</option>
                <option value="FEU High School">FEU High School</option>
                <option value="FEU Alabang">FEU Alabang</option>
                <option value="FEU Roosevelt">FEU Roosevelt</option>
            </select>
            <input type="text" placeholder="Email" v-model="email" required />
            <div v-if="!isEmailUnique" class="error">Email is already registred. Please use a different one.</div>
            <input type="password" placeholder="Password" v-model="password" required />
            <input type="password" placeholder="Re-enter Password" v-model="passwordCheck" required />
            <div v-if="!isPasswordSame" class="error">Passwords do not match. Please try again.</div>
            <base-button type="submit" mode="dark">Register</base-button>
        </form>
    </section>
</template>

<style scoped>
    .register {
        padding: 3rem 0rem;
        width: 513.25px;
    }
    .register__header {
        font-size: 5rem;
        font-weight: 700;
        letter-spacing: 2px;
    }
    .register__form {
        display: flex;
        flex-direction: column;
        margin: 0.8rem 0.3rem;
    }
    input {
        font: inherit;
        padding: 0.2rem;
        margin: 0.5rem 0rem;

    }
    .register__back {
        cursor: pointer;
        display: flex;
        align-items: center;
    }
    .register__back-icon {
        background-image: url('../assets/back.svg');
        background-size: cover;
        width: 1.5rem;
        height: 1.5rem;
    }
    .register__office {
        font: inherit;
        padding: 0.2rem;
        margin: 0.5rem 0rem;
        background-color: white;
        
    }
    .error {
        font-size: 0.8rem;
        color: var(--red-800);
    }
</style>