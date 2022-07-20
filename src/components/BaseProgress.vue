<script setup lang="ts">
    import { ref, onBeforeUpdate, onMounted } from "vue"

    const props = defineProps(["actionBy"])
    const completed = ref<String[]>([])
    const pending = ref<String[]>([])

    function updateStatus() {
        completed.value = []
        pending.value = []

        const roles = ['director', 'hsu', 'hr', 'sdas', 'user', 'finance']
        const roleIndex = roles.indexOf(props.actionBy)

        if (props.actionBy === "none") {
            for (let i = 0; i < roles.length; i++) {
                completed.value.push(roles[i])
            }
        } else {
            for (let i = 0; i < roleIndex; i++) {
                completed.value.push(roles[i])
            }
            for (let i = roleIndex; i < roles.length; i++) {
                pending.value.push(roles[i])
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
        <div  class="progress__dark" v-for="item in completed"></div>
        <div  class="progress__light" v-for="item in pending"></div>
    </div>
</template>

<style scoped>
    .progress {
        display: flex;
        gap: 2px;
    }
    .progress__dark {
        width: 20px;
        height: 10px;
        background-color: var(--neutral-700);
        border: 2px solid var(--neutral-700);
    }
    .progress__light {
        width: 20px;
        height: 10px;
        border: 2px solid var(--neutral-700);
    }
</style>