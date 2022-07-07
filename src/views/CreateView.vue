<script setup lang="ts">
    import CreateInfo from "@/components/CreateInfo.vue"
    import CreateReimbursement from "@/components/CreateReimbursement.vue"
    import CreateUploads from "@/components/CreateUploads.vue"
    import CreateModal from "@/components/CreateModal.vue"

    import { onBeforeMount, onMounted } from "vue"
    import { useCreateStore } from "@/stores/create"
    import { useUserStore } from "@/stores/user"
    import { storeToRefs } from "pinia"
    import { useRouter } from "vue-router"
    
    import { secureGetReq, securePostReq, secureImgPostReq } from "@/helpers/fetch"

    import type { Reimbursement } from "@/types"

    import nprogress from "nprogress"

    const userStore = useUserStore()
    const createStore = useCreateStore()

    const router = useRouter()

    const { userId, token } = storeToRefs(userStore)
    const {
        purpose,
        office,
        department,
        reimbursements,
        reimbursementTotal,
        files
    } = storeToRefs(createStore)

    async function getCrf() {
        const url = "/api/tickets"

        const tickets = await secureGetReq(url, token.value as string)
        const crfArr: number[] = []
        tickets.forEach(ticket => {
            crfArr.push(ticket.crf)
        })

        if (crfArr.length === 0) {
            const crf = 1000
            return crf
        } else {
            const crf = Math.max(...crfArr) + 1
            return crf 
        }
    }

    async function createTicket() {
        nprogress.start()
        if (office.value === "") {
            createStore.updateIsOfficeEmpty()
            nprogress.done()
            return
        } else {
            createStore.updateIsOfficeEmpty()
        }

        if (department.value === "") {
            createStore.updateIsDepartmentEmpty()
            nprogress.done()
            return
        } else {
            createStore.updateIsDepartmentEmpty()
        }

        if (reimbursementTotal.value < 500) {
            createStore.updateIsTotalBelowMin()
            nprogress.done()
            return
        } else {
            createStore.updateIsTotalBelowMin()
        }

        if (!files.value) {
            createStore.updateIsUploadEmpty()
            nprogress.done()
            return
        } else {
            createStore.updateIsUploadEmpty()
        }

        const crf = await getCrf()

        let reimbArr: Reimbursement[] = []

        if (reimbursements.value){
            for (let i = 0; i < reimbursements.value.length; i++) {
                const reimbursementBody = {
                    expenseDate: reimbursements.value[i].expenseDate,
                    expenseAmount: reimbursements.value[i].expenseAmount,
                    expenseNature: reimbursements.value[i].expenseNature,
                    approved: false,
                    rowNumber: null
                }

                reimbArr.push(reimbursementBody)
            }
        }

        let images: {}[] = []

        if (files.value) {
            for (let i = 0; i < files.value.length; i++) {
                images.push({
                    link: "http://159.223.45.163/uploads/" + files.value[i].name
                })
            }
        }

        const url = "/api/tickets"
        const ticketPayload = {
            creatorId: userId.value,
            crf: crf,
            purpose: purpose.value,
            office: office.value,
            department: department.value,
            actionBy: "director",
            status: "Pending Director Action",
            reimbursements: reimbArr,
            images: images
        }
            
        await securePostReq(url, token.value as string, ticketPayload)

        if (files.value) {
            const url = "/api/upload"

            const fd = new FormData()

            Array.from(files.value).forEach(file => {
                fd.append("uploads", file)
            })

            await secureImgPostReq(url, token.value as string, fd)
        }

        purpose.value = ""
        office.value = ""
        department.value = ""
        reimbursements.value = null
        files.value =  null

        nprogress.done()
        router.push("/overview/pending")
    }

    onBeforeMount(() => {
        nprogress.start()
    })

    onMounted(() => {
        nprogress.done()
    })
</script>

<template>
    <section class="create">
        <create-info></create-info>
        <create-reimbursement></create-reimbursement>
        <create-uploads></create-uploads>
        <create-modal></create-modal>
        <base-button @click="createTicket" mode="dark">Create</base-button>
    </section>
</template>

<style scoped>
    .create {
        width: 900px;
    }
</style>