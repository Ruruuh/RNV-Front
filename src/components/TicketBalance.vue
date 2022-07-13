<script setup lang="ts">
    import { computed } from "vue"
    import { storeToRefs } from 'pinia'
    import { useUserStore } from "@/stores/user"
    import { useTicketStore } from '@/stores/ticket'

    const userStore = useUserStore()
    const ticketStore = useTicketStore()
    const { role, overview } = storeToRefs(userStore)
    const { ticket, balance, amount, preparedBy, isBalanceEmpty } = storeToRefs(ticketStore)

    const fullName = computed(() => {
        const firstName = ticket.value?.creatorInfo.firstName
        const lastName = ticket.value?.creatorInfo.lastName

        const name = firstName + " " + lastName
        return name
    })

    const currentDate = computed(() => {
        const today = new Date().toISOString()
        return today.slice(0, 10)
    })
</script>

<template>
    <div class="balance__divider" v-if="ticket?.balance || role === 'hr'"></div>
    <div class="balance" v-if="ticket?.balance">
        <div class="balance__header">Medicine Balance Info</div>
        <div class="balance__row">
            <div class="balance__label">Name</div>
            <div class="balance__name">{{ fullName }}</div>
        </div>
        <div class="balance__row">
            <div class="balance__label">Balance as of {{ currentDate }}</div>
            <div class="balance__balance">{{ ticket.balance.balance }}</div>
        </div>
        <div class="balance__row">
            <div class="balance__label">Amount</div>
            <div class="balance__amount">{{ ticket.balance.amount }}</div>
        </div>  
        <div class="balance__row">
            <div class="balance__label">Prepared By</div>
            <div class="balance__prepared">{{ ticket.balance.preparedBy }}</div>
        </div>      
    </div>
    <div class="balance" v-if="role === 'hr' && overview === 'pending'">
        <div class="balance__header">Medicine Balance Info</div>
        <div class="balance__row">
            <div class="balance__label">Name</div>
            <div class="balance__name">{{ fullName }}</div>
        </div>
        <div class="balance__row">
            <div class="balance__label">Balance as of {{ currentDate }}</div>
            <input type="number" v-model="balance" required />
        </div>
        <div class="balance__row">
            <div class="balance__label">Amount</div>
            <input type="number" v-model="amount" required />
        </div>  
        <div class="balance__row">
            <div class="balance__label">Prepared By</div>
            <input type="text" v-model="preparedBy" required />
        </div> 
        <div v-if="isBalanceEmpty" class="error">Please fill up all balance fields.</div>     
    </div>
</template>

<style scoped>
    .balance {
        margin: 1rem 0rem;
    }
    .balance__divider {
        width: 100%;
        height: 1px;
        background-color: var(--neutral-200);
        margin: 1rem 0rem;        
    }
    .balance__header {
        font-size: 1.5rem;
        font-weight: 700;
        padding: 1rem 0rem;
    }
    .balance__row {
        display: flex;
        margin: 0.5rem 0rem;
        align-items: center;
    }
    .balance__label {
        font-weight: 700;
        width: 16rem;
    }
    input {
        font: inherit;
        padding: 0.2rem;
        width: 24rem;
    }
    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button {
        appearance: none;
    }
    .error {
        font-size: 0.8rem;
        color: var(--red-800);
    }
</style>