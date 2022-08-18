<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import { useTicketStore } from '@/stores/ticket'

const userStore = useUserStore()
const { role, overview } = storeToRefs(userStore)
const ticketStore = useTicketStore()
const { feedbackStatus, publicRemarksInput, privateRemarksInput } = storeToRefs(ticketStore)

function updateInput() {
    let input = ""

    if (feedbackStatus.value === 'approved') {
        input = 'Approved. All attachments and requirements are validated for reimbursement.'
    } else if (feedbackStatus.value === 'some') {
        input = 'Approved. Some attachments and requirements are not valid for reimbursement. Only selected reimbursements are approved.'
    } else if (feedbackStatus.value === 'total') {
        input = 'Rejected. Attachments and requirements are validated, but the total amount needed for reimbursement is below the minimum 500.'
    } else if (feedbackStatus.value === 'balance') {
        input = 'Rejected. Attachments and requirements are validated, but the associate balance is insufficient.'
    } else if (feedbackStatus.value === 'invalid') {
        input = 'Rejected. All attachments and requirements are not valid for reimbursement.'
    }

    publicRemarksInput.value = input
    privateRemarksInput.value = input
}
</script>

<template>
    <div class="status" v-if="role !== 'user' && overview === 'pending'">
        <div class="status__divider"></div>
        <div class="status__header">Status</div>
        <div class="status__copy">Choose a status to update remarks and internal comments. You can still modify them
            after.</div>
        <div class="status__selection">
            <div class="status__label">Status</div>
            <select class="status__select" @change="updateInput" v-model="feedbackStatus">
                <option value="">-- Please choose status --</option>
                <option value="approved">Approved</option>
                <option value="some">Some Approved</option>
                <option value="total" v-if="role === 'hr' || role === 'finance'">Reimbursement Total Under Minimum</option>
                <option value="balance" v-if="role === 'hr' || role === 'finance'">Client Balance Insufficient</option>
                <option value="invalid">Not Valid</option>
            </select>
        </div>
    </div>
</template>

<style scoped>
.status__divider {
    width: 100%;
    height: 1px;
    background-color: var(--neutral-200);
    margin: 2rem 0rem;
}

.status__header {
    font-size: 1.5rem;
    font-weight: 700;
}

.status__copy {
    padding: 2rem 0;
}

.status__selection {
    display: flex;
    margin: 0.5rem 0;
    align-items: center;
}

.status__select {
    font: inherit;
    padding: 0.2rem;
    background-color: white;
}

.status__label {
    font-weight: 700;
    width: 10rem;
}
</style>