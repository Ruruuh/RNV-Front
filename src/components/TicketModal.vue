<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import { useTicketStore } from '@/stores/ticket'
import { securePatchReq } from '@/helpers/fetch'
import { useRouter } from "vue-router"

import nprogress from "nprogress"

const userStore = useUserStore()
const ticketStore = useTicketStore()
const { userId, role, token, userDepartment } = storeToRefs(userStore)
const {
    ticket,
    approvedRows,
    approvedReimbursementTotal,
    publicRemarksInput,
    privateRemarksInput,
    isModalShown,
    balanceDate,
    currentBalance,
    preparedBy,
    mode,
    isHardcopyToggleShown
} = storeToRefs(ticketStore)

const router = useRouter()

function getActionBy() {
    const roles = ["director", "hsu", "hr", "sdas", "user", "finance", "none"]
    const ccsroles= ["director", "sdirector", "hsu", "hr", "sdas", "user", "finance", "none"]

    let index = 0

    if (ticket.value?.department === 'Computer Science' || ticket.value?.department === 'Information Technology') {
        index = ccsroles.indexOf(role.value as string)
    } else {
        index = roles.indexOf(role.value as string)
    }

    let actionBy = ""

    if (approvedRows.value?.length === 0) {
        actionBy = "none"
    } else if (approvedReimbursementTotal.value < 500) {
        actionBy = "none"
    } else {
        if (ticket.value?.department === 'Computer Science' || ticket.value?.department === 'Information Technology') {
            actionBy = ccsroles[index + 1]
        } else {
            actionBy = roles[index + 1]
        }
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

    if (!balanceDate.value || !preparedBy.value) {
        const balanceInfo = null
        return balanceInfo
    } else {
        if (currentBalance.value) {
            const balanceInfo = {
                ticketId: ticket.value?.id,
                name: name,
                balanceDate: balanceDate.value,
                amount: currentBalance.value - approvedReimbursementTotal.value,
                preparedBy: preparedBy.value
            }
            currentBalance.value = currentBalance.value - approvedReimbursementTotal.value
            return balanceInfo
        } else {
            if (ticket.value?.creatorInfo.balance) {
                currentBalance.value = ticket.value.creatorInfo.balance
                const balanceInfo = {
                    ticketId: ticket.value?.id,
                    name: name,
                    balanceDate: balanceDate.value,
                    amount: currentBalance.value - approvedReimbursementTotal.value,
                    preparedBy: preparedBy.value
                }
                currentBalance.value = currentBalance.value - approvedReimbursementTotal.value
                return balanceInfo
            }
        }
    }
}

function getStatus() {
    let status = ""
    const actionBy = getActionBy()
    const roles= ["director", "sdirector", "hsu", "hr", "sdas", "finance"]
    const rolesTitleCase = ["Director", "S.Director", "HSU", "HR", "SDAS", "Finance"]
    const roleTitleCaseIndex = roles.indexOf(role.value as string)
    const roleTitleCase = rolesTitleCase[roleTitleCaseIndex]
    if (approvedRows.value?.length === 0) {
        status = `${roleTitleCase} Rejected`
    } else if (approvedReimbursementTotal.value < 500) {
        status = `${roleTitleCase} Rejected`
    } else {
        if (actionBy === "none") {
            status = "Completed"
        } else if (actionBy === "sdirector") {
            status = "Director Approved"
        } else if (actionBy === "hsu") {
            status = "Director Approved"
            if (ticket.value?.department === 'Computer Science' || ticket.value?.department === 'Information Technology') {
                status = "S.Director Approved"
            } else {
                status = "Director Approved"
            }
        } else if (actionBy === "hr") {
            status = "HSU Approved"
        } else if (actionBy === "sdas") {
            status = "HR Approved"
        } else if (actionBy === "user") {
            status = "SDAS Approved"
        } else if (actionBy === "finance") {
            status = "Hardcopy Provided"
        }
    }
    return status
}

async function adminUpdate() {
    nprogress.start()
    if (role.value === "hr") {
        if (!balanceDate.value || !preparedBy.value) {
            ticketStore.updateIsBalanceEmpty()
            ticketStore.updateIsModalShown()
            nprogress.done()
            return
        } else {
            ticketStore.updateIsBalanceEmpty()
        }
    }

    if (publicRemarksInput.value === "" || privateRemarksInput.value === "") {
        ticketStore.updateIsInputBlank()
        ticketStore.updateIsModalShown()
        nprogress.done()
        return
    } else {
        ticketStore.updateIsInputBlank()
    }

    const url = "/api/tickets/admin/" + ticket.value?.crf

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
        userId: ticket.value?.creatorId,
        ticketId: ticket.value?.id,
        department: userDepartment, 
        crf: ticket.value?.crf,
        email: ticket.value?.creatorInfo.email,
        actionBy: actionBy,
        status: status,
        reimbursements: reimbursements,
        remarks: remarks,
        balance: balanceInfo,
        updatedBalance: currentBalance.value
    }

    await securePatchReq(url, token.value as string, payload)

    ticketStore.$reset()

    nprogress.done()
    router.push("/overview/pending")
}

async function userUpdate() {
    nprogress.start()
    const url = "/api/tickets/user/" + ticket.value?.crf

    const payload = {
        ticketId: ticket.value?.id,
        actionBy: "finance",
        status: "Hardcopy Provided",
        hasHardcopy: isHardcopyToggleShown.value
    }

    await securePatchReq(url, token.value as string, payload)

    ticketStore.$reset()

    nprogress.done()
    router.push("/overview/pending")
}

async function updateTicket() {
    if (ticket.value?.actionBy === 'user') {
        if (!isHardcopyToggleShown.value) {
            return
        }
        const lastUpdate = ticket.value.createdAt.toString().slice(0, 10)
        const today = new Date().toLocaleString().slice(0, 10)

        const start: any = new Date(lastUpdate)
        const end: any = new Date(today)

        const diffInMs = end - start
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24)

        if (diffInDays > 7) {
            nprogress.start()
            const url = "/api/tickets/user/" + ticket.value?.crf

            const payload = {
                ticketId: ticket.value?.id,
                actionBy: "none",
                status: "Rejected",
                hasHardcopy: isHardcopyToggleShown.value
            }

            await securePatchReq(url, token.value as string, payload)

            ticketStore.$reset()

            nprogress.done()
            router.push("/overview/pending")
        } else {
            await userUpdate()
        }
    } else {
        await adminUpdate()
    }
}

async function rejectTicket() {
    approvedRows.value = []
    ticketStore.updateIsModalShown()
    await adminUpdate()
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
                <div>The changes from this action is not reversible.</div>
                <div v-if="mode === 'update'">Before saving, please check if everything is correct.</div>
                <div v-if="mode === 'reject'">Before rejecting, please check if everything is correct.</div>
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