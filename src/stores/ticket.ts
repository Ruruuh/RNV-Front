import { defineStore } from "pinia"
import type { Ticket, Reimbursement } from "@/types"
import CreateReimbursementVue from "@/components/CreateReimbursement.vue"

export const useTicketStore = defineStore({
    id: "ticket",
    state: () => ({
        ticketId: null as null | Number,
        ticket: null as null | Ticket,

        reimbursements: null as null | Array<Reimbursement>,
        reimbursementTotal: 0,
        approvedReimbursementTotal: 0,
        approvedRows: null as null | Array<Number>,
        isAllApproved: false,

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
        publicFeedbackObj: {} as { [key: string]: string },
        privateFeedbackObj: {} as { [key: string]: string },

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
                this.updateAllApprovedToggle()
            }
            this.ticket?.reimbursements.forEach(reimbursement => {
                if (this.approvedRows?.includes(reimbursement.id)) {
                    reimbursement.approved = true
                } else {
                    reimbursement.approved = false
                }
            })
            this.updateApprovedReimbursementTotal()
        },
        updateIsAllApproved() {
            this.isAllApproved = !this.isAllApproved
        },
        updateAllApprovedToggle() {
            if (this.approvedRows === null || this.approvedRows.length === 0) {
                this.isAllApproved = !this.isAllApproved
            }
            const reimbursementIds: number[] = []
            const approvedRows: null | number[] = this.approvedRows as number[]
            this.ticket?.reimbursements.forEach(reimbursement => {
                reimbursementIds.push(reimbursement.id)
            })
            reimbursementIds.sort((a, b) => a < b ? -1 : a > b ? 1 : 0)
            approvedRows.sort((a, b) => a < b ? -1 : a > b ? 1 : 0)

            if (reimbursementIds.length === approvedRows.length && reimbursementIds.every(function (value, index) { return value === approvedRows[index] })) {
                this.isAllApproved = true
            } else {
                this.isAllApproved = false
            }
        },
        updateApprovals() {
            if (!this.isAllApproved) {
                this.updateIsAllApproved()
                this.ticket?.reimbursements.forEach(reimbursement => {
                    reimbursement.approved = true
                })
                this.approveAll()
                console.log('updateApprovals')
            } else {
                this.updateIsAllApproved()
                this.ticket?.reimbursements.forEach(reimbursement => {
                    reimbursement.approved = false
                })
                console.log('removeApprovals')
                this.removeApprovals()
            }
            this.updateFeedbackStatus()
        },
        approveAll() {
            let approvedRowsArr: number[] = []
            this.ticket?.reimbursements.forEach(reimbursement => {
                approvedRowsArr.push(reimbursement.id)
            })
            this.approvedRows = approvedRowsArr
            this.updateApprovedReimbursementTotal()
        },
        removeApprovals() {
            this.approvedRows = []
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
        },
        updateFeedbackStatus() {
            if (this.isAllApproved) {
                this.feedbackStatus = 'approved'
            } else if (this.approvedRows) {
                if (this.approvedRows.length > 0 && !this.isAllApproved) {
                    this.feedbackStatus = 'some'
                } else if (this.approvedRows.length === 0) {
                    this.feedbackStatus = 'invalid'
                }
            }

            let input = ''

            if (this.feedbackStatus=== 'approved') {
                input = 'Approved. All attachments and requirements are validated for reimbursement.'
            } else if (this.feedbackStatus=== 'some') {
                input = 'Approved. Some attachments and requirements are not valid for reimbursement. Only selected reimbursements are approved.'
            } else if (this.feedbackStatus=== 'total') {
                input = 'Rejected. Attachments and requirements are validated, but the total amount needed for reimbursement is below the minimum 500.'
            } else if (this.feedbackStatus=== 'balance') {
                input = 'Rejected. Attachments and requirements are validated, but the associate balance is insufficient.'
            } else if (this.feedbackStatus=== 'invalid') {
                input = 'Rejected. All attachments and requirements are not valid for reimbursement.'
            }

            this.publicRemarksInput = input
            this.privateRemarksInput = input
        }
    }
})