<script setup lang="ts">
    import { storeToRefs } from 'pinia'
    import { useUserStore } from '@/stores/user'
    import { useRouter } from 'vue-router'

    const store = useUserStore()
    const { isLoggedIn, role } = storeToRefs(store)
    const router = useRouter()

    function logout() {
        localStorage.clear()
        store.$reset()
        router.push('/entry')
    }

    function goToHome() {
        router.push('/home')
    }

    function goToPendingView() {
        router.push('/overview/pending')
    }
    
    function goToCompletedView() {
        router.push('/overview/completed')
    }

    function goToCreateView() {
        router.push('/create')
    }

    function goToForecastView() {
        router.push('/forecast')
    }
</script>

<template>
    <section class="header">
        <div class="header__banner-wrapper">
            <div class="header__banner"></div>
        </div>
        <div class="header__actions">
            <div @click="goToHome" class="header__home">Reimbursement Sytem</div>
            <nav class="main-nav" v-if="isLoggedIn">
                <ul class="main-nav__list">
                    <li @click="goToPendingView" class="main-nav__item">Pending Tickets</li>
                    <li @click="goToCompletedView" class="main-nav__item">Completed Tickets</li>
                    <li @click="goToCreateView" v-if="role === 'user'" class="main-nav__item">Create Ticket</li>
                    <li @click="goToForecastView" v-else class="main-nav__item">Forecasts</li>
                </ul>
            </nav>
            <base-button v-if="isLoggedIn" @click="logout" mode="light">Logout</base-button>
        </div>
    </section>
</template>

<style scoped>
        .header {
            width: 900px;
            background-color: var(--green-800);
            color: var(--neutral-50);
            padding: 0.8rem 0rem;
        }
        .header__banner-wrapper {
            display: flex;
            justify-content: center;
        }
        .header__banner {
            background-image: url('../assets/logo.png');
            background-size: contain;
            background-color: var(--green-800);
            width: 30rem;
            height: 6.2rem;
        }
        .header__actions {
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding: 0.8rem 0rem;
        }
        .header__home {
            cursor: pointer;
        }
        .header__home:hover {
            color: var(--neutral-200);
        }
        .main-nav__list {
            display: flex;
            list-style-type: none;
            gap: 1rem;
        }
        .main-nav__item {
            font-size: 0.9rem;
            cursor: pointer;
        }
        .main-nav__item:hover {
            color: var(--neutral-200);
        }
</style>