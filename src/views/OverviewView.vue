<script setup lang="ts">
    import { ref, onBeforeMount } from "vue"
    import { useRouter } from "vue-router"
    import { storeToRefs } from "pinia"
    import { useUserStore } from "@/stores/user"
    import { search } from "@/helpers/search"
    import { secureGetReq } from "@/helpers/fetch"
    import type { Ticket } from "@/types"
    import nprogress from "nprogress"

    const props = defineProps(["overviewType"])

    const store = useUserStore()
    const { userId, role, department, token } = storeToRefs(store)

    const tickets = ref<null | Ticket[]>(null)
    const searchInput = ref("")
    const tempTickets = ref<null | Ticket[]>(null)

    const router = useRouter()

    function updateRowNumbers() {
        let rowNumber = 1
        tickets.value?.forEach(ticket => {
            ticket.rowNumber = rowNumber
            rowNumber += 1
        })
    }

    function searchTicket() {
        let text = ""

        tickets.value?.forEach(ticket => {
            text += ticket.crf.toString()
        })

        const pattern = searchInput.value
        const shift = search(pattern, text)

        let index = 0

        if (shift === -1) {
            index = -1
        } else {
            index = shift / pattern.length
        }

        if (index !== -1) {
            if (tickets.value) {
                tempTickets.value = tickets.value
                tickets.value = [tickets.value[index]]
                updateRowNumbers()
            }
        } else {
            return
        }
    }

    function clearInput() {
        searchInput.value = "",
        tickets.value = tempTickets.value
        updateRowNumbers()
    }

    function viewTicket(ticketCrf: number) {
        router.push("/ticket/" + ticketCrf.toString())
    }

    async function getTickets(role: string, id: number, status: string) {
        nprogress.start()
        const url = "/api/tickets/" + role + "/" + id + "/" + status
        const ticketsRes = await secureGetReq(url, token.value as string)
        const filteredTickets: null | Ticket[] = []

        const departments = ["MA", "CS", "IT", "CpE", "ME", "CE", "EE", "MPS", "HSC"]
        const deptTitleCase = [
            "Multimedia Arts", 
            "Computer Science", 
            "Information Technology",
            "Computer Engineering",
            "Mechanical Engineering", 
            "Civil Engineering", 
            "Electronics and Electrical Engineering", 
            "Mathematics and Physical Sciences",
            "Humanities, Social Sciences, and Communication"
        ]
        const index = departments.indexOf(department.value as string)
        const deptTitle = deptTitleCase[index]

        if (role === "director") {
            ticketsRes.forEach(ticket => {
                if (ticket.department === deptTitle) {
                    filteredTickets.push(ticket)
                }
            })
            nprogress.done()
            tickets.value = filteredTickets
            updateRowNumbers()
        } else {
            nprogress.done()
            tickets.value = ticketsRes
            updateRowNumbers()
        }
    }

    onBeforeMount(() => {
        if (props.overviewType === "pending") {
            if (role.value === "user") {
                getTickets(role.value, userId.value as number, props.overviewType)
            } else {
                getTickets(role.value as string, userId.value as number, props.overviewType)
                store.updateOverview("pending")
            }
        } else if (props.overviewType === "completed") {
            if (role.value === "user") {
                getTickets(role.value, userId.value as number, props.overviewType)
            } else {
                getTickets(role.value as string, userId.value as number, props.overviewType)
                store.updateOverview("completed")
            }
        }
    })
</script>

<template>
    <section class="overview">
        <div class="overview__header">
            <div v-if="props.overviewType === 'pending'" class="overview__title">Pending Tickets</div>
            <div v-if="props.overviewType === 'completed'" class="overview__title">Completed Tickets</div>
            <form @submit.prevent="searchTicket">
                <div class="overview__wrapper">
                    <input type="text" placeholder="Search" v-model="searchInput"/>
                    <div @click="clearInput" class="overview__clear"></div>
                </div>
            </form>
        </div>
        <div class="overview__divider"></div>
        <div class="overview__tickets">
            <div class="overview__table">
                <div class="overview__column-headers">
                    <div>Row #</div>
                    <div>CRF #</div>
                    <div>Date Filed</div>
                    <div>Status</div>
                    <div>Progress</div>
                    <div>Action</div>
                </div>
                <base-row
                    @viewRow="viewTicket($event)"
                    class="overview__row"
                    v-for="ticket in tickets"
                    :key="ticket.rowNumber"
                    :id="ticket.id"
                    :rowNumber="ticket.rowNumber"
                    :crf="ticket.crf"
                    :date="ticket.createdAt.toString().slice(0, 10)"
                    :status="ticket.status"
                    mode="overview"
                ></base-row>
            </div>
        </div>
    </section>
</template>

<style scoped>
    .overview{
        width: 900px;
    }
    .overview__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .overview__wrapper {
        border: 1px solid var(--neutral-700);
        border-radius: 2px;
        display: flex;
        align-items: center;
        height: 33px;
        width: 10rem;
        padding: 0.3rem;
        background-color: white;
    }
    .overview__clear {
        background-image: url("../assets/close.svg");
        background-size: cover;
        width: 1.2rem;
        height: 1.2rem;
        cursor: pointer;
    }
    .overview__title {
        font-size: 2rem;
        font-weight: 700;
        padding: 1rem 0rem;
    }
    input {
        font: inherit;
        padding: 0.2rem;
        width: 8rem;
        margin: 0.5rem 0rem;
        border: none;
    }
    input:focus {
        outline: none;
    }
    .overview__divider {
        width: 100%;
        height: 1px;
        background-color: var(--neutral-200);
    }
    .overview__column-headers {
        display: grid;
        justify-items: center;
        align-items: center;
        padding: 1rem 0rem;
        border-bottom: 1px solid var(--neutral-200);
        grid-template-columns: 0.5fr 1fr 1fr 2fr 1.5fr 1fr;
    }
    .overview__column-headers div {
        text-align: center;
        font-weight: 700;
    }
    .overview__row:nth-child(even) {
        background-color: var(--neutral-100);
    }
</style>