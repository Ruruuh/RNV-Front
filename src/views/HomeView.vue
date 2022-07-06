<script setup lang="ts">
    import { ref, computed, onBeforeMount } from "vue"
    import { storeToRefs } from "pinia"
    import { search } from "@/helpers/search"
    import { secureGetReq } from "@/helpers/fetch"
    import { useUserStore } from "@/stores/user"
    import type { Ticket } from "@/types"
    import nprogress from "nprogress"

    const ticketToShow = ref<null | Ticket>(null)
    const tickets = ref<null | Ticket[]>(null)
    const searchInput = ref("")

    const store = useUserStore()
    const { role, department, token } = storeToRefs(store)

    const roles = ["director", "hsu", "hr", "sdas", "finance", "none"]
    const rolesTitleCase = ["Director", "HSU", "HR", "SDAS", "Finance"]

    const approvedBy = computed(() => {
        if (ticketToShow.value) {
            const actionByIndex = roles.indexOf(ticketToShow.value.actionBy)
            const approvedByIndex = actionByIndex - 1

            if (approvedByIndex !== -1) {
                return rolesTitleCase[approvedByIndex]
            } else {
                return "No one yet."
            }
        }
    })

    const toApprove = computed(() => {
        if (ticketToShow.value) {
            const actionByIndex = roles.indexOf(ticketToShow.value.actionBy)
            if (actionByIndex !== 5) {
                return rolesTitleCase[actionByIndex]
            } else if (ticketToShow.value.status === "Rejected") {
                return "No one. Ticket is rejected."
            } else {
                return "No one. Ticket is approved by all."
            }
        }
    })

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
                ticketToShow.value = tickets.value[index]
            }
        } else {
            return
        }
    }

    function clearInput() {
        ticketToShow.value = null
        searchInput.value = ""
    }

    async function getAllTickets() {
        nprogress.start()
        const url = "/api/tickets"
        const filteredTickets: Ticket[] = []
        const ticketsRes = await secureGetReq(url, token.value as string)

        if (role.value === "director") {
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
            ticketsRes.forEach(ticket => {
                if (ticket.department === deptTitle) {
                    filteredTickets.push(ticket)
                }
            })
            nprogress.done()
            tickets.value = filteredTickets
        } else {
            nprogress.done()
            tickets.value = ticketsRes
        }
    }

    onBeforeMount(() => {
        getAllTickets()
    })
</script>

<template>
    <section class="home">
        <div class="home__header">Welcome.</div>
        <div class="home__subheader">Here's what you can do.</div>
        <div v-if="role === 'user'" class="home__copy">
            <div><strong>Pending tickets</strong> - See a list of all your remaining tickets as well as its current status.</div>
            <div><strong>Completed tickets</strong> - See a list of all the tickets that had been approved/rejected.</div>
            <div><strong>Create ticket</strong> - Create a ticket to be reviewed by the Director, HSU, HR, SDAS, and Finance.</div>
        </div>
        <div v-else class="home__copy">
            <form @submit.prevent="searchTicket">
                <div class="home__search">
                    <input type="text" placeholder="Search for a ticket." v-model="searchInput"/>
                    <div @click="clearInput" class="home__clear"></div>
                </div>
            </form>
            <div v-if="ticketToShow" class="home__ticket">
                <div class="ticket__header">Ticket #{{ ticketToShow.crf }}</div>
                <div>Date Filed: {{ ticketToShow.createdAt.toString().substring(0, 10) }}</div>
                <div>Approved By: {{ approvedBy }}</div>
                <div>To Approve: {{ toApprove }}</div>
                <base-progress :actionBy="ticketToShow.actionBy"></base-progress>
            </div>
            <div><strong>Pending tickets</strong> - See a list of all the tickets that need your action.</div>
            <div><strong>Completed tickets</strong> - See a list of all the tickets that had moved forward.</div>
            <div><strong>Forecast</strong> - Get a view of the expected count of requests throughout the year.</div>
        </div>
    </section>
</template>

<style scoped>
    .home {
        padding: 3rem 0rem;
        width: 513.25px;
    }
    .home__header {
        font-size: 5rem;
        font-weight: 700;
        letter-spacing: 2px;
    }
    .home__subheader {
        font-size: 1.5rem;
        letter-spacing: 2px;
        padding: 0.3rem;
    }
    .home__copy div {
        font-size: 1.2rem;
        letter-spacing: 2px;
        margin: 0.8rem 0rem;
    }
    .home__copy {
        padding: 0.3rem;
    }
    .home__search {
        border: 1px solid var(--neutral-700);
        border-radius: 2px;
        display: flex;
        align-items: center;
        width: 20rem;
        padding: 0rem 0.5rem;
        background-color: white;
    }
    .home__clear {
        background-image: url("../assets/close.svg");
        background-size: cover;
        width: 1.2rem;
        height: 1.2rem;
        cursor: pointer;
    }
    .home__ticket {
        margin: 5rem 0rem;
    }
    .ticket__header {
        font-weight: 700;
    }
    input {
        font: inherit;
        padding: 0.2rem;
        width: 18rem;
        border: none;
    }
    input:focus {
        outline: none;
    }
</style>