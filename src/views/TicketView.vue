<script setup lang="ts">
import TicketInfo from '@/components/TicketInfo.vue'
import TicketReimbursement from '@/components/TicketReimbursement.vue'
import TicketUploads from '@/components/TicketUploads.vue'
import TicketBalance from '@/components/TicketBalance.vue'
import TicketStatus from '@/components/TicketStatus.vue'
import TicketRemarks from '@/components/TicketRemarks.vue'
import TicketModal from '@/components/TicketModal.vue'
import TicketHardcopy from '@/components/TicketHardcopy.vue'

import { computed, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import { useTicketStore } from '@/stores/ticket'
import { secureGetReq } from '@/helpers/fetch'

import nprogress from "nprogress"

const userstore = useUserStore()
const ticketstore = useTicketStore()

const { role, overview, token } = storeToRefs(userstore)
const {
    ticket,
    mode
} = storeToRefs(ticketstore)

const props = defineProps(["ticketCrf"])

async function getTicket() {
    nprogress.start()
    const url = "/api/tickets/" + props.ticketCrf.toString()

    const response = await secureGetReq(url, token.value as string)
    ticket.value = response

    ticketstore.updateRowNumbers()
    ticketstore.updateReimbursementTotal()
    ticketstore.getApprovedRows()
    ticketstore.updateApprovedReimbursementTotal()
    ticketstore.getRemarks()
    nprogress.done()
}

const isSaveShown = computed(() => {
    if (ticket.value?.actionBy === "user" && role.value === 'user') {
        return true
    } else if (role.value === "user") {
        return false
    } else if (overview.value === "completed") {
        return false
    } else {
        return true
    }
})

function updateTicket() {
    mode.value = "update"
    ticketstore.updateIsModalShown()
}

function rejectTicket() {
    mode.value = "reject"
    ticketstore.updateIsModalShown()
}

onBeforeMount(() => {
    getTicket()
})
</script>

<template>
    <section class="ticket">
        <ticket-info></ticket-info>
        <ticket-reimbursement></ticket-reimbursement>
        <ticket-uploads></ticket-uploads>
        <ticket-balance></ticket-balance>
        <ticket-status></ticket-status>
        <ticket-remarks></ticket-remarks>
        <ticket-modal></ticket-modal>
        <ticket-hardcopy></ticket-hardcopy>
        <base-button v-if="isSaveShown" @click="updateTicket" mode="dark">Save</base-button>
        <div class="ticket__divider"></div>
        <base-button v-if="role !== 'user' && role !== 'hr' && overview !== 'completed'" @click="rejectTicket"
            mode="red">Reject</base-button>
    </section>
</template>

<style scoped>
.ticket {
    width: 900px;
}

.ticket__divider {
    width: 100%;
    height: 1px;
    background-color: var(--neutral-200);
    margin: 2rem 0rem;
}
</style>