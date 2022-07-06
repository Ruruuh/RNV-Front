<template>
    <div class="modal">
        <div class="modal__content">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
    .modal {
        position: fixed;
        z-index: 1;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: var(--neutral-300);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .modal__content {
        background-color: var(--neutral-50);
        border-radius: 0.5rem;
        padding: 2rem;
        display: flex;
        flex-direction: column;
    }
</style>