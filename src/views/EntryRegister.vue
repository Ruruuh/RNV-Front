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

    const hasSmallChar = ref(false)
    const hasLargeChar = ref(false)
    const hasNumChar = ref(false)
    const hasSpecialChar = ref(false)
    const isMinLength = ref(false)
    const isPasswordValid = ref(true)

    function goBack() {
        router.go(-1)
    }

    function updateIsPasswordValid() {
        if (hasSmallChar.value && hasLargeChar.value && hasNumChar.value && hasSpecialChar.value && isMinLength.value) {
            isPasswordValid.value = true
        } else {
            isPasswordValid.value = false
        }
    }

    function checkPasswordValidity(password) {
        const smallChar = new RegExp('[a-z]+')
        const largeChar = new RegExp('[A-Z]+')
        const numChar = new RegExp('[0-9]+')
        const specialChar = new RegExp('[^a-zA-Z0-9]+')

        smallChar.test(password) ? hasSmallChar.value = true : hasSmallChar.value = false
        largeChar.test(password) ? hasLargeChar.value = true : hasLargeChar.value = false
        numChar.test(password) ? hasNumChar.value = true : hasNumChar.value = false
        specialChar.test(password) ? hasSpecialChar.value = true : hasSpecialChar.value = false
        password.length >= 8 ? isMinLength.value = true : isMinLength.value = false
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
        if (!(hasSmallChar.value && hasLargeChar.value && hasNumChar.value && hasSpecialChar.value && isMinLength.value)) {
            updateIsPasswordValid()
            nprogress.done()
            return
        } else {
            updateIsPasswordValid()
        }
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
            <input type="password" placeholder="Password" @input="checkPasswordValidity(password)" @change="checkPasswordValidity(password)" v-model="password" required />
            <div class="guide" :class="hasSmallChar ? 'valid' : 'invalid'" v-if="password.length > 0">&nbsp;&nbsp;- should have at least one(1) small character</div>
            <div class="guide" :class="hasLargeChar ? 'valid' : 'invalid'" v-if="password.length > 0">&nbsp;&nbsp;- should have at least one(1) large character</div>
            <div class="guide" :class="hasNumChar ? 'valid' : 'invalid'" v-if="password.length > 0">&nbsp;&nbsp;- should have at least one(1) number</div>
            <div class="guide" :class="hasSpecialChar ? 'valid' : 'invalid'" v-if="password.length > 0">&nbsp;&nbsp;- should have at least one(1) special character</div>
            <div class="guide" :class="isMinLength ? 'valid' : 'invalid'" v-if="password.length > 0">&nbsp;&nbsp;- should be at least eight(8) characters long</div>
            <div v-if="!isPasswordValid" class="error">Password is not valid. Please try again.</div>
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
    .guide {
        font-size: 0.8rem;
    }
    .valid {
        color: var(--green-800);
    }
    .invalid {
        color: var(--red-800);
    }
    .error {
        font-size: 0.8rem;
        color: var(--red-800);
    }
</style>