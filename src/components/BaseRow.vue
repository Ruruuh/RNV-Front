<script setup lang="ts">
import { ref, onBeforeMount, onUpdated } from "vue"
import { storeToRefs } from "pinia"
import { useUserStore } from "@/stores/user"
import { secureGetReq } from "@/helpers/fetch"

const store = useUserStore()
const { role, overview, token } = storeToRefs(store)

const props = defineProps({
    id: Number,
    reimbursementId: Number,
    rowNumber: Number,
    crf: Number,
    date: String,
    orNum: Number,
    amount: Number,
    status: String,
    nature: String,
    mode: String,
    department: String,
    approved: Boolean
})

const actionBy = ref<null | string>(null)

const emit = defineEmits([
    "editRow",
    "viewRow",
    "deleteRow",
    "updateApprovedRows"
])

function passRow() {
    if (props.mode === "create") {
        emit("editRow", props.rowNumber)
    } else if (props.mode === "overview") {
        emit("viewRow", props.crf)
    }
}

function passRowToDelete() {
    emit("deleteRow", props.rowNumber)
}

function passReimbursementId() {
    if (
        overview.value === "completed" ||
        role.value === "user" ||
        role.value === "hr"
    ) {
        return
    } else {
        emit("updateApprovedRows", props.reimbursementId)
    }
}

async function getActionBy() {
    const url = "/api/tickets/" + props.crf
    if (token.value) {
        const response = await secureGetReq(url, token.value as string)
        actionBy.value = response.actionBy
    }
}

onBeforeMount(() => {
    if (props.mode !== "ticket" && props.mode !== "create") {
        getActionBy()
    }
})
onUpdated(() => {
    if (props.mode !== "ticket" && props.mode !== "create") {
        getActionBy()
    }
})
</script>

<template>
    <section :class="props.mode">
        <div>{{ props.rowNumber }}</div>
        <div v-if="props.mode === 'overview'">{{ props.crf }}</div>
        <div>{{ props.date }}</div>
        <div v-if="props.mode !== 'overview'">{{ props.orNum }}</div>
        <div v-if="props.mode !== 'overview'">{{ props.amount }}</div>
        <div v-if="props.mode === 'overview'">{{ props.status }}</div>
        <div v-if="props.mode !== 'overview'">{{ props.nature }}</div>
        <base-progress v-if="props.mode !== 'ticket' && props.mode !== 'create'" :actionBy="actionBy"
            :department="department"></base-progress>
        <div v-if="props.mode !== 'ticket'" class="row__actions">
            <base-button @click="passRow" mode="darkSmall">View</base-button>
            <base-button v-if="props.mode === 'create'" @click="passRowToDelete" mode="redSmall">Delete</base-button>
        </div>
        <div v-if="props.mode === 'ticket'" class="row__actions">
            <base-toggle v-if="props.mode === 'ticket'" @click="passReimbursementId" :approved="props.approved">
            </base-toggle>
        </div>
    </section>
</template>

<style scoped>
.row {
    display: grid;
    justify-items: center;
    align-items: center;
    padding: 0.5rem 0rem;
    border-bottom: 1px solid var(--neutral-200);
    grid-template-columns: 1fr 1fr 1fr 2fr 2fr;
}

.create {
    display: grid;
    justify-items: center;
    align-items: center;
    padding: 0.5rem 0rem;
    border-bottom: 1px solid var(--neutral-200);
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 2fr;
}

.overview {
    display: grid;
    justify-items: center;
    align-items: center;
    padding: 0.5rem 0rem;
    border-bottom: 1px solid var(--neutral-200);
    grid-template-columns: 0.5fr 1fr 1fr 2fr 1.5fr 1fr;
}

.ticket {
    display: grid;
    justify-items: center;
    align-items: center;
    padding: 0.5rem 0rem;
    border-bottom: 1px solid var(--neutral-200);
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
}

.row__actions {
    display: flex;
    gap: 0.8rem;
}
</style>
