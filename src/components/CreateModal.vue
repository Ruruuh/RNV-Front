<script setup lang="ts">
    import { storeToRefs } from "pinia"
    import { useCreateStore } from "@/stores/create"

    const store = useCreateStore()
    const { 
        isModalDisplayed,
        isDateEmpty,
        isAmountUnderMin,
        isNatureEmpty,
        reimbursements,
        reimbursementDate,
        reimbursementAmount,
        reimbursementNature,
        indexToUpdate,
        modifyType
    } = storeToRefs(store)

    function resetData() {
        reimbursementDate.value = ""
        reimbursementAmount.value = 0
        reimbursementNature.value = ""
    }

    function addReimbursement() {
        const item = {
            expenseDate: reimbursementDate.value,
            expenseAmount: reimbursementAmount.value,
            expenseNature: reimbursementNature.value,
            rowNumber: null
        }

        if (reimbursementDate.value === "") {
            store.updateIsDateEmpty()
            return
        } else {
            store.updateIsDateEmpty()
        }

        if (reimbursementAmount.value < 300) {
            store.updateIsAmountUnderMin()
            return
        } else {
            store.updateIsAmountUnderMin()
        }

        if (reimbursementNature.value === "") {
            store.updateIsNatureEmpty()
            return
        } else {
            store.updateIsNatureEmpty()
        }

        if (!reimbursements.value) {
            reimbursements.value = [item]
        } else {
            reimbursements.value.push(item)
        }

        store.updateIsModalDisplayed()
        store.updateRowNumbers()
        store.updateReimbursementTotal()
        resetData()
    }

    function updateReimbursement() {
        const updatedItem = {
            expenseDate: reimbursementDate.value,
            expenseAmount: reimbursementAmount.value,
            expenseNature: reimbursementNature.value,
            rowNumber: null
        }

        if (reimbursementDate.value === "") {
            store.updateIsDateEmpty()
            return
        } else {
            store.updateIsDateEmpty()
        }

        if (reimbursementAmount.value < 300) {
            store.updateIsAmountUnderMin()
            return
        } else {
            store.updateIsAmountUnderMin()
        }

        if (reimbursementNature.value === "") {
            store.updateIsNatureEmpty()
            return
        } else {
            store.updateIsNatureEmpty()
        }

        const index = indexToUpdate.value

        if (reimbursements.value) {
            reimbursements.value[index] = updatedItem
        }

        store.updateIsModalDisplayed()
        store.updateRowNumbers()
        store.updateReimbursementTotal()

        modifyType.value = "add"

        resetData()
    }

    function closeModal() {
        store.updateIsModalDisplayed()
        modifyType.value = "add"

        resetData()
    }
</script>

<template>
    <Teleport to="#app">
        <base-modal v-if="isModalDisplayed">
            <div class="modal__header">
                <div v-if="modifyType === 'add'" class="modal__title">New Reimbursement</div>
                <div v-if="modifyType === 'update'" class="modal__title">Update Reimbursement</div>
                <div @click="closeModal" class="modal__close"></div>                
            </div>
            <div class="modal__divider"></div>
            <div class="modal__input">
                <div class="modal__label">Expenditure Date</div>
                <input type="date" v-model="reimbursementDate" />
            </div>
            <div class="error" v-if="isDateEmpty">Please choose a date.</div>
            <div class="modal__input">
                <div class="modal__label">Amount</div>
                <input type="number" v-model="reimbursementAmount" />
            </div>
            <div class="error" v-if="isAmountUnderMin">Amount cannot be below 300. Please try again.</div>
            <div class="modal__input">
                <div class="modal__label">Nature of Expenditure</div>
                <input type="text" v-model="reimbursementNature" />
            </div>
            <div class="error" v-if="isNatureEmpty">Please enter nature of expense.</div>
            <base-button v-if="modifyType === 'add'" @click="addReimbursement" mode="dark" class="modal__add">Add</base-button>
            <base-button v-if="modifyType === 'update'" @click="updateReimbursement" mode="dark" class="modal__add">Update</base-button>
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
    .modal__input {
        padding-top: 0.8rem;
    }
    .modal__label {
        font-size: 1.2rem;
        font-weight: 700;
    }
    .modal__add {
        margin-top: 2rem;
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