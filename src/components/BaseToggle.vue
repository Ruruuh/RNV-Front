<script setup lang="ts">
    import { ref, onBeforeMount, watch } from "vue"
    import { storeToRefs } from "pinia"
    import { useUserStore } from "@/stores/user"

    const props = defineProps(["approved"])

    const isToggleShown = ref<null | boolean>(false)

    const store = useUserStore()
    const { role, overview } = storeToRefs(store)

    function updateIsToggleShown() {
        if (
            overview.value === "completed" ||
            role.value === "user" ||
            role.value === "hr"
        ) {
            return
        } else {
            isToggleShown.value = !isToggleShown.value
            console.log('triggered')
        }
    }

    watch(() => props.approved, () => {
        if (props.approved !== isToggleShown.value) {
            updateIsToggleShown()
        }
    })
    onBeforeMount(() => {
        if (!props.approved) {
            isToggleShown.value = false
        } else {
            isToggleShown.value = true
        }
    })
</script>

<template>
    <div @click="updateIsToggleShown" class="toggle">
        <div v-if="isToggleShown" class="toggle__mark"></div>
    </div>
</template>

<style scoped>
    .toggle {
        border-radius: 2px;
        border: 1px solid var(--neutral-700);
        width: 0.9rem;
        height: 0.9rem;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }
    .toggle__mark {
        background-color: var(--neutral-700);
        border-radius: 1px;
        width: 0.5rem;
        height: 0.5rem;
    }
</style>