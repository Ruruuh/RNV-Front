import { defineStore } from "pinia"
import type { Ticket, Reimbursement } from "@/types"

export const useTicketStore = defineStore({
    id: "ticket",
    state: () => ({
        ticketId: null as null | Number,
        ticket: null as null | Ticket,

        reimbursements: null as null | Array<Reimbursement>,
        reimbursementTotal: 0,
        approvedReimbursementTotal: 0,
        approvedRows: null as null | Array<Number>,

        balanceDate: "",
        currentBalance: null as null | number,
        preparedBy: null as null | string,
        isBalanceEmpty: false,

        isInputBlank: false,
        feedbackStatus: "",
        publicRemarksInput: "",
        privateRemarksInput: "",
        publicFeedback: {},
        privateFeedback: {},
        publicFeedbackObj: {} as {[key: string]: string},
        privateFeedbackObj: {} as {[key: string]: string},
        
        isModalShown: false,
        mode: "",

        isHardcopyToggleShown: false
    }),
    actions: {
        updateRowNumbers() {
            let rowNumber = 1
            this.ticket?.reimbursements.forEach(item => {
                item.rowNumber = rowNumber
                rowNumber += 1
            })
        },
        updateReimbursementTotal() {
            const amountArr: null | number[] = []
            this.ticket?.reimbursements.forEach(item => {
                amountArr.push(item.expenseAmount)
            })
            const total = amountArr.reduce((a, b) => a + b, 0)
            this.reimbursementTotal = total
        },
        updateApprovedReimbursementTotal() {
            let total = 0
            this.approvedRows?.forEach(row => {
                this.ticket?.reimbursements.forEach(item => {
                    if (item.id === row) {
                        total += item.expenseAmount
                    }
                })
            })
            this.approvedReimbursementTotal = total
        },
        updateIsBalanceEmpty() {
            if (!this.balanceDate || !this.preparedBy) {
                this.isBalanceEmpty = true
            } else {
                this.isBalanceEmpty = false
            }
        },
        updateIsInputBlank() {
            if (this.publicRemarksInput === "" || this.privateRemarksInput === "") {
                this.isInputBlank = true
            } else {
                this.isInputBlank = false
            }
        },
        updateIsModalShown() {
            this.isModalShown = !this.isModalShown
        },
        getApprovedRows() {
            let approvedRows: null | number[] = []
            this.ticket?.reimbursements.forEach(item => {
                if (item.approved) {
                    approvedRows?.push(item.id)
                }
            })
            this.approvedRows = approvedRows
        },
        updateApprovedRows(reimbursementId: number) {
            let approvedRowsArr = this.approvedRows
            if (approvedRowsArr) {
                const index = approvedRowsArr.indexOf(reimbursementId)
                if (index >= 0) {
                    const indexToRemove = index
                    approvedRowsArr.splice(indexToRemove, 1)
                } else {
                    approvedRowsArr.push(reimbursementId)
                    this.approvedRows = approvedRowsArr
                }
            }
            this.updateApprovedReimbursementTotal()
        },
        getRemarks() {
            this.publicFeedback = {}
            this.privateFeedback = {}
            this.publicFeedbackObj = {}
            this.privateFeedbackObj = {}
            const roles = ["director", "sdirector", "hsu", "hr", "sdas", "finance"]
            const remarks = this.ticket?.remarks
            remarks?.forEach(remark => {
                if (remark.type === "public") {
                    this.publicFeedbackObj[remark.role] = remark.content
                } else {
                    this.privateFeedbackObj[remark.role] = remark.content
                }
            })

            roles.forEach(role => {
                if (this.publicFeedbackObj[role]) {
                    this.publicFeedback[role] = this.publicFeedbackObj[role]
                } else {
                    this.publicFeedback[role] = "-"
                }
                if (this.privateFeedbackObj[role]) {
                    this.privateFeedback[role] = this.privateFeedbackObj[role]
                } else {
                    this.privateFeedback[role] = "-"
                }
            })
        }
     }
})