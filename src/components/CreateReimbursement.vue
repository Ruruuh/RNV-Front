<script setup lang="ts">
    import { storeToRefs } from "pinia"
    import { useCreateStore } from "@/stores/create"
    import type { Reimbursement } from "@/types"

    const store = useCreateStore()
    const {
        isTotalBelowMin,
        reimbursements,
        reimbursementDate,
        reimbursementAmount,
        reimbursementNature,
        reimbursementTotal,
        indexToUpdate,
        modifyType
    } = storeToRefs(store)

    function editReimbursement(index: number) {
        let itemToEdit: null | Reimbursement = null

        if (reimbursements.value) {
            itemToEdit = reimbursements.value[index - 1]
        }

        if (itemToEdit) {
            reimbursementDate.value = itemToEdit.expenseDate
            reimbursementAmount.value = itemToEdit.expenseAmount
            reimbursementNature.value = itemToEdit.expenseNature
        }

        indexToUpdate.value = index - 1

        modifyType.value = "update"
        store.updateIsModalDisplayed()
    }

    function deleteReimbursement(index: number) {
        if (reimbursements.value) {
            reimbursements.value.splice(index - 1, 1)
        }

        store.updateRowNumbers()
        store.updateReimbursementTotal()
    }
</script>

<template>
    <div class="reimbursement">
        <div class="reimbursement__header">
            <div class="reimbursement__title">Reimbursement</div>
            <base-button @click="store.updateIsModalDisplayed" mode="dark">Add Reimbursement</base-button>
        </div>
        <div class="reimbursement__table">
            <div class="reimbursement__column-headers">
                <div>Row #</div>
                <div>Expense Date</div>
                <div>Amount</div>
                <div>Nature of Expenditure</div>
                <div>Actions</div>
            </div>
        </div>
        <base-row 
            @deleteRow="deleteReimbursement($event)" 
            @editRow="editReimbursement($event)" 
            class="reimbursement__row" 
            v-for="item in reimbursements"
            :key="item.rowNumber"
            :rowNumber="item.rowNumber"
            :date="item.expenseDate"
            :amount="item.expenseAmount"
            :nature="item.expenseNature"
            mode="create"
        ></base-row>
        <div class="reimbursement__total">Total Amount: {{ reimbursementTotal }}</div>
        <div v-if="isTotalBelowMin" class="error">Total should be 500 at minimum. Please add reimbursement item.</div>
    </div>
</template>

<style scoped>
    .reimbursement__header {
        display: flex;
        justify-content: space-between;
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
        grid-template-columns: 1fr 1fr 1fr 2fr 2fr;
    }
    .reimbursement__column-headers div {
        text-align: center;
        font-weight: 700;
    }
    .reimbursement__row:nth-child(odd) {
        background-color: var(--neutral-100);
    }
    .reimbursement__total {
        font-size: 1.2rem;
        font-weight: 700;
        margin: 2rem 0rem;
    }
    .error {
        font-size: 0.8rem;
        color: var(--red-800);
    }
</style>