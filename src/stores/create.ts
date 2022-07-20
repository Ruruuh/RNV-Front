import { defineStore } from "pinia"
import type { Reimbursement } from "@/types"

export const useCreateStore = defineStore({
    id: "create",
    state: () => ({
        purpose: "",
        office: "",
        department: "",

        isPurposeEmpty: false,
        isOfficeEmpty: false,
        isDepartmentEmpty: false,
        isDateEmpty: false,
        isDateInvalid: false,
        isOrEmpty: false,
        isTotalBelowMin: false,
        isNatureEmpty: false,
        isUploadEmpty: false,
        isModalDisplayed: false,
        isAmountUnderMin: false,

        reimbursements: null as null | Reimbursement[],
        reimbursementDate: "",
        orNum: 0,
        reimbursementAmount: 0,
        reimbursementNature: "",
        reimbursementTotal: 0,

        modifyType: "add",
        indexToUpdate: 0,

        files: null as null | FileList
    }),
    actions: {
        updateIsModalDisplayed() {
            this.isModalDisplayed = !this.isModalDisplayed
        },
        updateIsPurposeEmpty() {
            if (this.purpose === "") {
                this.isPurposeEmpty = true
            } else {
                this.isPurposeEmpty = false
            }
        },
        updateIsOfficeEmpty() {
            if (this.office === "") {
                this.isOfficeEmpty = true
            } else {
                this.isOfficeEmpty = false
            }
        },
        updateIsDepartmentEmpty() {
            if (this.department === "") {
                this.isDepartmentEmpty = true
            } else {
                this.isDepartmentEmpty = false
            }
        },
        updateIsTotalBelowMin() {
            if (this.reimbursementTotal < 500) {
                this.isTotalBelowMin = true
            } else {
                this.isTotalBelowMin = false
            }
        },
        updateIsDateEmpty() {
            if (this.reimbursementDate === "") {
                this.isDateEmpty = true
            } else {
                this.isDateEmpty = false
            }
        },
        updateIsDateInvalid() {
            const today = new Date().toLocaleString().slice(0, 9)
            const todayItem = new Date(today).getTime()
            const date = new Date(this.reimbursementDate).toLocaleString().slice(0, 9)
            const dateItem = new Date(date).getTime()
            if (dateItem > todayItem) {
                this.isDateInvalid = true
            } else {
                this.isDateInvalid = false
            }
        },
        updateIsOrEmpty() {
            if (this.orNum === 0) {
                this.isOrEmpty = true
            } else {
                this.isOrEmpty = false
            }
        },
        updateIsAmountUnderMin() {
            if (this.reimbursementAmount === 0) {
                this.isAmountUnderMin = true
            } else {
                this.isAmountUnderMin = false
            }
        },
        updateIsNatureEmpty() {
            if (this.reimbursementNature === "") {
                this.isNatureEmpty = true
            } else {
                this.isNatureEmpty = false
            }
        },
        updateIsUploadEmpty() {
            if (!this.files) {
                this.isUploadEmpty = true
            } else {
                this.isUploadEmpty = false
            }
        },
        updateRowNumbers() {
            let rowNumber = 1

            if (this.reimbursements) {
                this.reimbursements.forEach(item => {
                    item.rowNumber = rowNumber
                    rowNumber += 1
                })
            }
        },
        updateReimbursementTotal() {
            const amountArr: number[] = []

            if (this.reimbursements) {
                this.reimbursements.forEach(item => {
                    amountArr.push(item.expenseAmount)
                })
            }
    
            const total = amountArr.reduce((a, b) => a + b, 0)
            this.reimbursementTotal = total
        }
    }
})