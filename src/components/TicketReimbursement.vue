<script setup lang="ts">
    import { useUserStore } from '@/stores/user'
    import { useTicketStore } from '@/stores/ticket'
    import { storeToRefs } from 'pinia'

    const userStore = useUserStore()
    const ticketStore = useTicketStore()
    const { role } = storeToRefs(userStore)
    const { ticket, reimbursementTotal, approvedReimbursementTotal } = storeToRefs(ticketStore)
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
                <div>Approve</div>
            </div>
        </div>
        <base-row            
            @updateApprovedRows="ticketStore.updateApprovedRows($event)"
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
    .reimbursement__total {
        margin: 2rem 0rem;
    }
    .reimbursement__amount {
        font-size: 1.2rem;
        font-weight: 700;
    }
</style>