<script setup lang="ts">
    import { ref } from 'vue'
    import { useUserStore } from '@/stores/user'
    import { useTicketStore } from '@/stores/ticket'
    import { storeToRefs } from 'pinia'
    
    const userStore = useUserStore()
    const ticketStore = useTicketStore()
    const { role } = storeToRefs(userStore)
    const { ticket, reimbursementTotal, approvedReimbursementTotal, approvedRows, isAllApproved } = storeToRefs(ticketStore)
    
    const approveAllToggle = ref<HTMLElement>()

    function updateReimbursement(event) {
        ticketStore.updateApprovedRows(event)
        const isApprovedRowsEmpty = approvedRows.value === null || approvedRows.value.length === 0 ? true : false
        const reimbursementIds: number[] = []
        ticket.value?.reimbursements.forEach(reimbursement => {
            reimbursementIds.push(reimbursement.id)
        })
        reimbursementIds.sort((a, b) => a < b ? -1 : a > b ? 1 : 0)
        approvedRows.value?.sort((a, b) => a < b ? -1 : a > b ? 1 : 0)
        const isApprovedRowsFull = reimbursementIds.length === approvedRows.value?.length && reimbursementIds.every(function(value, index) { return value === approvedRows.value?.[index]})
        console.log(isApprovedRowsFull)
        if(isAllApproved.value === false && isApprovedRowsEmpty) {
            approveAllToggle.value?.click()
        }
        if(isAllApproved.value === true && isApprovedRowsFull) {
            approveAllToggle.value?.click()
        }
        ticketStore.updateFeedbackStatus()
    }
</script>

<template>
    <div class="reimbursement">
        <div class="reimbursement__header">
            <div class="reimbursement__title">Reimbursement</div>
        </div>
        <div class="reimbursement__table">
            <div class="reimbursement__column-headers">
                <div>Row #</div>
                <div>Expense Date</div>
                <div>OR Number</div>
                <div>Amount</div>
                <div>Nature</div>
                <div class="reimbursement__approve">
                    <div>Approve</div>
                    <base-toggle @click="ticketStore.updateApprovals" ref="approveAllToggle"></base-toggle>
                </div>
            </div>
        </div>
        <base-row            
            @updateApprovedRows="updateReimbursement($event)"
            class="reimbursement__row" v-for="item in ticket?.reimbursements"
            :key="item.rowNumber"
            :reimbursementId="item.id"
            :rowNumber="item.rowNumber"
            :date="item.expenseDate"
            :orNum="item.orNum"
            :amount="item.expenseAmount"
            :nature="item.expenseNature"
            :approved="item.approved"
            mode="ticket"
        ></base-row>
        <div class="reimbursement__total">
            <div class="reimbursement__amount">Total Amount: {{ reimbursementTotal }}</div>
        </div>
        <div class="reimbursement__total">
            <div class="reimbursement__amount">Total Approved Amount: {{ approvedReimbursementTotal }}</div>
            <div class="reimbursement__note" v-if="role !== 'user'">* If ticket is saved while total approved is below 500, it will be rejected.</div>
        </div>
    </div>
</template>

<style scoped>
    .reimbursement__header {
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
    .reimbursement__title {
        font-size: 1.5rem;
        font-weight: 700;
    }
    .reimbursement__column-headers {
        display: grid;
        justify-items: center;
        align-items: center;
        padding: 1rem 0rem;
        border-bottom: 1px solid var(--neutral-200);
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    }
    .reimbursement__column-headers div {
        text-align: center;
        font-weight: 700;
    }
    .reimbursement__row:nth-child(odd) {
        background-color: var(--neutral-100);
    }
    .reimbursement__approve {
        display: flex;
        align-items: center;
        gap: 0.8rem;
    }
    .reimbursement__total {
        margin: 2rem 0rem;
    }
    .reimbursement__amount {
        font-size: 1.2rem;
        font-weight: 700;
    }
</style>