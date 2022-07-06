<script setup lang="ts">
    import { storeToRefs } from 'pinia'
    import { useUserStore } from '@/stores/user'
    import { useTicketStore } from '@/stores/ticket'
    import { securePatchReq } from '@/helpers/fetch'
    import { useRouter } from "vue-router"

    import nprogress from "nprogress"

    const userStore = useUserStore()
    const ticketStore = useTicketStore()
    const { role, token } = storeToRefs(userStore)
    const { 
        ticket, 
        approvedRows,
        approvedReimbursementTotal, 
        publicRemarksInput, 
        privateRemarksInput, 
        isModalShown,
        balance,
        amount,
        preparedBy,
        mode
    } = storeToRefs(ticketStore)

    const router = useRouter()

    function getActionBy() {
        const roles = ["director", "hsu", "hr", "sdas", "finance", "none"]
        let index = roles.indexOf(role.value as string)

        let actionBy = ""

        if (approvedRows.value?.length === 0) {
            actionBy = "none"
        } else if (approvedReimbursementTotal.value < 500) {
            actionBy = "none"
        } else {
            actionBy = roles[index + 1]
        }

        return actionBy
    }

    function getReimbursements() {
        const reimbursements = ticket.value?.reimbursements

        reimbursements?.forEach(reimbursement => {
            if (approvedRows.value?.includes(reimbursement.id)) {
                reimbursement.approved = true
            } else {
                reimbursement.approved = false
            }
        })

        return reimbursements
    }

    function getBalance() {
        const firstName = ticket.value?.creatorInfo.firstName
        const lastName = ticket.value?.creatorInfo.lastName
        const name = firstName + " " + lastName

        const balanceInfo = {
            ticketId: ticket.value?.id,
            name: name,
            balance: balance.value,
            amount: amount.value,
            preparedBy: preparedBy.value
        }

        return balanceInfo
    }

    function getStatus() {
        let status = ""
        const actionBy = getActionBy()
        if (approvedRows.value?.length === 0) {
            status = "Rejected"
        } else if (approvedReimbursementTotal.value < 500) {
            status = "Rejected"
        } else {
            if (actionBy === "none") {
                status = "Completed"
            } else if (actionBy === "hsu") {
                status = "Director Approved"
            } else if (actionBy === "hr") {
                status = "HSU Approved"
            } else if (actionBy === "sdas") {
                status = "HR Approved"
            } else if (actionBy === "finance") {
                status = "SDAS Approved"
            }
        }
        return status
    }

    async function updateTicket() {
        nprogress.start()
        if (!balance.value || !amount.value || !preparedBy.value) {
            ticketStore.updateIsBalanceEmpty()
            ticketStore.updateIsModalShown()
            nprogress.done()
            return
        } else {
            ticketStore.updateIsBalanceEmpty()
        }
        if (publicRemarksInput.value === "" || privateRemarksInput.value === "") {
            ticketStore.updateIsInputBlank()
            ticketStore.updateIsModalShown()
            nprogress.done()
            return
        } else {
            ticketStore.updateIsInputBlank()
        }

        const url = "/api/tickets/" + ticket.value?.crf

        const actionBy = getActionBy()
        const status = getStatus()
        const reimbursements = getReimbursements()
        const balanceInfo = getBalance()
        const remarks = [
            {
                ticketId: ticket.value?.id,
                type: "public",
                role: role.value,
                content: publicRemarksInput.value
            },
            {
                ticketId: ticket.value?.id,
                type: "private",
                role: role.value,
                content: privateRemarksInput.value
            }
        ]

        const payload = {
            ticketId: ticket.value?.id,
            actionBy: actionBy,
            status: status,
            reimbursements: reimbursements,
            remarks: remarks,
            balance: balanceInfo
        }

        await securePatchReq(url, token.value as string, payload)

        publicRemarksInput.value = ""
        privateRemarksInput.value = ""
        
        ticketStore.updateIsModalShown()

        nprogress.done()
        router.push("/overview/pending")
    }

    async function rejectTicket() {
        approvedRows.value = []
        ticketStore.updateIsModalShown()
        await updateTicket()
    }

    function closeModal() {
        ticketStore.updateIsModalShown()
    }
</script>

<template>
    <Teleport to="#app">
        <base-modal v-if="isModalShown">
            <div class="modal__header">
                <div class="modal__title">Confirmation</div>
                <div @click="closeModal" class="modal__close"></div>
            </div>
            <div class="modal__divider"></div>
            <div class="modal__content">
                <div>Hey, there.</div>
                <div>The changes from this action is not reversible.</div>
                <div>Before saving, please check if everything is correct.</div>
                <div>Done double checking? Please click below.</div> 
            </div>
            <base-button @click="updateTicket" v-if="mode === 'update'" mode="darkSmall">Save</base-button>
            <base-button @click="rejectTicket" v-if="mode === 'reject'" mode="redSmall">Reject</base-button>
        </base-modal>
    </Teleport>
</template>

<style scoped>
    .modal__header {
        display: flex;
        justify-content: space-between;
        margin: 0.8rem 0rem;
    }
    .modal__title {
        font-size: 1.5rem;
        font-weight: 700;
    }
    .modal__close {
        background-image: url("../assets/close.svg");
        background-size: cover;
        width: 1.5rem;
        height: 1.5rem;
        cursor: pointer;
    }
    .modal__content {
        font-size: 1.2rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin: 1.5rem 0rem;
    }
</style>