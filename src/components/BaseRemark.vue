<script setup lang="ts">
    import { computed } from "vue"
    import { storeToRefs } from 'pinia'
    import { useUserStore } from '@/stores/user'
    import { useTicketStore } from '@/stores/ticket'

    const userstore = useUserStore()
    const ticketstore = useTicketStore()

    const { role, overview } = storeToRefs(userstore)
    const { publicRemarksInput, privateRemarksInput } = storeToRefs(ticketstore)

    const props = defineProps({
        roleListItem: String,
        content: String,
        type: String
    })
    
    const admin = computed(() => {
        const roles = ["director", "sdirector", "hsu", "hr", "sdas", "finance"]
        const rolesTitleCase = ["Director", "Senior Director", "HSU", "HR", "SDAS", "Finance"]
        const index = roles.indexOf(props.roleListItem as string)
        return rolesTitleCase[index]
    })
</script>

<template>
    <div class="remarks__row" v-if="role === 'user'">
        <div class="remarks__label">{{ admin }} Remarks</div>
        <div class="remarks__content">{{ content }}</div>
    </div>
    <div class="remarks__row" v-if="overview === 'pending'">
        <div class="remarks__label">{{ admin }}</div>
        <textarea class="remarks__input" v-model="publicRemarksInput" v-if="role === roleListItem && type === 'public'"></textarea>
        <textarea class="remarks__input" v-model="privateRemarksInput" v-if="role === roleListItem && type === 'private'"></textarea>
        <div class="remarks__content" v-if="role !== roleListItem">{{ content }}</div>
    </div>
    <div class="remarks__row" v-if="overview === 'completed'">
        <div class="remarks__label">{{ admin }}</div>
        <div class="remarks__content">{{ content }}</div>
    </div>
</template>

<style scoped>
    .remarks__row {
        display: flex;
        margin: 0.5rem 0rem;
        align-items: center;
    }
    .remarks__label {
        font-weight: 700;
        width: 10rem;
    }
    textarea {
        font: inherit;
        padding: 0.2rem;
        width: 30rem;
        height: 5rem;
        resize: none;
    }
</style>