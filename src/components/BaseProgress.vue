<script setup lang="ts">
import { ref, onBeforeUpdate, onMounted } from "vue"

const props = defineProps(["actionBy", "department"])
const completed = ref<String[]>([])
const pending = ref<String[]>([])
let roleIndex = ref<number>(0)

function updateStatus() {
    completed.value = []
    pending.value = []

    const roles = ['director', 'hsu', 'hr', 'sdas', 'user', 'finance']
    const ccsroles = ['director', 'sdirector', 'hsu', 'hr', 'sdas', 'user', 'finance']

    if (props.department === 'Computer Science' || props.department === 'Information Technology') {
        roleIndex.value = ccsroles.indexOf(props.actionBy)
    } else {
        roleIndex.value = roles.indexOf(props.actionBy)
    }

    if (props.actionBy === "none") {
        if (props.department === 'Computer Science' || props.department === 'Information Technology') {
            for (let i = 0; i < ccsroles.length; i++) {
                completed.value.push(roles[i])
            }
        } else {
            for (let i = 0; i < roles.length; i++) {
                completed.value.push(roles[i])
            }
        }
    } else {
        if (props.department === 'Computer Science' || props.department === 'Information Technology') {
            for (let i = 0; i < roleIndex.value; i++) {
                completed.value.push(ccsroles[i])
            }
            for (let i = roleIndex.value; i < ccsroles.length; i++) {
                pending.value.push(ccsroles[i])
            }
        } else {
            for (let i = 0; i < roleIndex.value; i++) {
                completed.value.push(roles[i])
            }
            for (let i = roleIndex.value; i < roles.length; i++) {
                pending.value.push(roles[i])
            }
        }
    }
}
onMounted(() => {
    updateStatus()
})
onBeforeUpdate(() => {
    updateStatus()
})
</script>

<template>
    <div class="progress">
        <div class="progress__dark" v-for="item in completed"></div>
        <div class="progress__light" v-for="item in pending"></div>
    </div>
</template>

<style scoped>
.progress {
    display: flex;
    gap: 2px;
}

.progress__dark {
    width: 15px;
    height: 10px;
    background-color: var(--neutral-700);
    border: 2px solid var(--neutral-700);
}

.progress__light {
    width: 15px;
    height: 10px;
    border: 2px solid var(--neutral-700);
}
</style>