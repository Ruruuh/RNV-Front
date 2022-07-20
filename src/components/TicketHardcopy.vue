<script setup lang="ts">
import { storeToRefs } from "pinia"
import { useUserStore } from "@/stores/user"
import { useTicketStore } from "@/stores/ticket"

const userStore = useUserStore()
const ticketStore = useTicketStore()
const { role } = storeToRefs(userStore)
const { isHardcopyToggleShown, ticket } = storeToRefs(ticketStore)

function updateIsToggleShown() {
    isHardcopyToggleShown.value = !isHardcopyToggleShown.value
}
</script>

<template>
    <div class="hardcopy" v-if="ticket?.actionBy === 'user' && role === 'user'">
        <div class="hardcopy__divider"></div>
        <div class="hardcopy__header">Hard copy</div>
        <div class="hardcopy__action">
            <div class="hardcopy__copy">Are the hard copies of receipts/prescriptions provided to finance?</div>
            <div @click="updateIsToggleShown" class="hardcopy__toggle">
                <div v-if="isHardcopyToggleShown" class="hardcopy__mark"></div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.hardcopy__divider {
    width: 100%;
    height: 1px;
    background-color: var(--neutral-200);
    margin: 2rem 0rem;
}

.hardcopy__header {
    font-size: 1.5rem;
    font-weight: 700;
}

.hardcopy__action {
    display: flex;
    gap: 2rem;
    margin: 2rem 0rem;
}

.hardcopy__toggle {
    border-radius: 2px;
    border: 1px solid var(--neutral-700);
    width: 0.9rem;
    height: 0.9rem;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

.hardcopy__mark {
    background-color: var(--neutral-700);
    border-radius: 1px;
    width: 0.5rem;
    height: 0.5rem;
}
</style>