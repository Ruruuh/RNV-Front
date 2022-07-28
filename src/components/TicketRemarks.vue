<script setup lang="ts">
import { computed } from "vue"
import { storeToRefs } from "pinia"
import { useUserStore } from "@/stores/user"
import { useTicketStore } from "@/stores/ticket"

const userstore = useUserStore()
const ticketstore = useTicketStore()

const { role, overview } = storeToRefs(userstore)
const { ticket, isInputBlank, publicFeedback, privateFeedback } = storeToRefs(ticketstore)

const roles = computed(() => {
    if (ticket.value?.department === 'Computer Science' || ticket.value?.department === 'Information Technology') {
        return ["director", "sdirector", "hsu", "hr", "sdas", "finance"]
    } else {
        return ["director", "hsu", "hr", "sdas", "finance"]
    }
})
</script>

<template>
    <div class="remarks__divider"></div>
    <div class="remarks" v-if="role === 'user'">
        <div class="remarks__header">Remarks</div>
        <div class="remarks__user">
            <base-remark v-for="role in roles" :roleListItem=role :content=publicFeedback[role]></base-remark>
        </div>
    </div>
    <div class="remarks__other" v-if="overview === 'pending'">
        <div class="remarks__header">Remarks</div>
        <div class="remarks__copy">These are feedback that will be seen by the user.</div>
        <div class="remarks__public">
            <base-remark v-for="role in roles" :roleListItem=role :content=publicFeedback[role] :type="'public'">
            </base-remark>
        </div>
        <div class="remarks__other-divider"></div>
        <div class="remarks__header">Internal Comments</div>
        <div class="remarks__copy">These are feedback that will only be seen by admins.</div>
        <div class="remarks__private">
            <base-remark v-for="role in roles" :roleListItem=role :content=privateFeedback[role] :type="'private'">
            </base-remark>
        </div>
        <div v-if="isInputBlank" class="error">Remarks and internal comments cannot be empty. Please update.</div>
    </div>
    <div class="remarks__other" v-if="overview === 'completed'">
        <div class="remarks__header">Remarks</div>
        <div class="remarks__copy">These are feedback that will be seen by the user.</div>
        <div class="remarks__public">
            <base-remark v-for="role in roles" :roleListItem=role :content=publicFeedback[role] :type="'public'">
            </base-remark>
        </div>
        <div class="remarks__other-divider"></div>
        <div class="remarks__header">Internal Comments</div>
        <div class="remarks__copy">These are feedback that will only be seen by the admins.</div>
        <div class="remarks__private">
            <base-remark v-for="role in roles" :roleListItem=role :content=privateFeedback[role] :type="'private'">
            </base-remark>
        </div>
    </div>
</template>

<style scoped>
.remarks {
    margin: 1rem 0rem;
}

.remarks__header {
    font-size: 1.5rem;
    font-weight: 700;
}

.remarks__divider {
    width: 100%;
    height: 1px;
    background-color: var(--neutral-200);
    margin: 2rem 0rem;
}

.remarks__other-divider {
    width: 100%;
    height: 1px;
    background-color: var(--neutral-200);
}

.remarks__user {
    margin: 1rem 0rem;
}

.remarks__other {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin: 1rem 0rem;
}

.error {
    font-size: 0.8rem;
    color: var(--red-800);
    margin: 2rem 0rem;
}
</style>

