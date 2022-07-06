<script setup lang="ts">
    import { onBeforeMount, onMounted } from 'vue'
    import { useUserStore } from '@/stores/user'

    const store = useUserStore()

    onBeforeMount(() => {
        const storageItem = localStorage.getItem('user')

        if (storageItem) {
            const user = JSON.parse(storageItem)
            store.updateStateFromStorage(user)
        }
    })
</script>

<template>
    <div class="container">
        <the-header></the-header>
        <router-view v-slot="{ Component, route }">
            <component :is="Component" :key="route.path"/>
        </router-view>
    </div>
</template>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter&display=swap');

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    :root {
        --green-800: #166534;
        --red-800: #991b1b;
        --neutral-50: #fafafa;
        --neutral-100: #f5f5f5;
        --neutral-200: #e5e5e5;
        --neutral-300: rgba(212, 212, 212, 0.5);
        --neutral-700: #404040;
        background-color: var(--neutral-50);
        color: var(--neutral-700);
        font-size: 18px;
        font-family: 'Inter', sans-serif;
        box-sizing: inherit;
    }
    .container {
        width: 100%;
        display: flex;
        align-items: center;
        flex-direction: column;
    }
</style>