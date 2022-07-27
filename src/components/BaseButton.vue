<script setup lang="ts">
    const props = defineProps(["mode"])
</script>

<template>
    <button :class="props.mode">
        <slot></slot>
    </button>
</template>

<style scoped>
    button {
        font: inherit;
        font-weight: 700;        
        cursor: pointer;
        padding: 0.2rem 0.5rem;
        margin: 0.5rem 0rem;
        font-size: 1.2rem;
        width: fit-content;
    }
    .dark {
        border: 4px solid var(--neutral-700);
        background-color: var(--neutral-50);
        color: var(--neutral-700);
    }
    .light {
        font-weight: 500;
        font-size: 1rem;
        border: 4px solid var(--neutral-50);
        background-color: var(--green-800);
        color: var(--neutral-50);
    }
    .red {
        border: 4px solid var(--red-800);
        background-color: var(--neutral-50);
        color: var(--red-800);
    }
    .darkSmall {
        font-size: 1rem;
        padding: 0.1rem 0.3rem;
        border: 4px solid var(--neutral-700);
        background-color: var(--neutral-50);
        color: var(--neutral-700);
        height: fit-content;
    }
    .redSmall {
        font-size: 1rem;
        padding: 0.1rem 0.3rem;
        border: 4px solid var(--red-800);
        background-color: var(--neutral-50);
        color: var(--red-800);
    }
</style>