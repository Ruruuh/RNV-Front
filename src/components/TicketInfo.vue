<script setup lang="ts">
    import { useTicketStore } from "@/stores/ticket"
    import { storeToRefs } from "pinia"
    import { useRouter } from "vue-router"

    const store = useTicketStore()
    const { ticket } = storeToRefs(store)

    const router = useRouter()

    function goBack() {
        router.go(-1)
    }
</script>

<template>
    <div class="ticket__header">
        <div class="ticket__title">Ticket CRF # {{ ticket?.crf }}</div>
        <div @click="goBack" class="ticket__back">
            <div class="ticket__back-icon"></div>
            <div class="ticket__back-copy">go back</div>
        </div>
    </div>
    <div class="ticket__divider"></div>
    <div class="ticket__info">
        <div class="ticket__row">
            <div class="ticket__label">First Name</div>
            <div class="ticket__firstName">{{ ticket?.creatorInfo.firstName }}</div>
        </div>
        <div class="ticket__row">
            <div class="ticket__label">Last Name</div>
            <div class="ticket__lastName">{{ ticket?.creatorInfo.lastName }}</div>
        </div>
        <div class="ticket__row">
            <div class="ticket__label">Date</div>
            <div class="ticket__date">{{ ticket?.createdAt.toString().slice(0,10) }}</div>
        </div>
        <div class="ticket__row">
            <div class="ticket__label">Purpose</div>
            <div class="ticket__purpose">{{ ticket?.purpose }}</div>
        </div>
        <div class="ticket__row">
            <div class="ticket__label">Office</div>
            <div class="ticket__office">{{ ticket?.office }}</div>
        </div>
        <div class="ticket__row">
            <div class="ticket__label">Department</div>
            <div class="ticket__office">{{ ticket?.department }}</div>
        </div>
    </div>
</template>

<style scoped>
    .ticket__header {
        display: flex;
        justify-content: space-between;
    }
    .ticket__title {
        font-size: 2rem;
        font-weight: 700;
        padding: 1rem 0rem;
    }
    .ticket__back {
        cursor: pointer;
        display: flex;
        align-items: center;
    }
    .ticket__back-icon {
        background-image: url('../assets/back.svg');
        background-size: cover;
        width: 1.5rem;
        height: 1.5rem;
    }
    .ticket__divider {
        width: 100%;
        height: 1px;
        background-color: var(--neutral-200);
    }
    .ticket__info {
        margin: 3rem 0rem;
    }
    .ticket__row {
        display: flex;
        margin: 0.5rem 0rem;
        align-items: center;
    }
    .ticket__label {
        font-weight: 700;
        width: 8rem;
    }
</style>