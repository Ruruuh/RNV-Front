<script setup lang="ts">
    import { computed } from "vue"
    import { storeToRefs } from "pinia"
    import { useCreateStore } from "@/stores/create"

    const store = useCreateStore()

    const { purpose, 
            office, 
            department, 
            isOfficeEmpty, 
            isDepartmentEmpty } = storeToRefs(store)

    const currentDate = computed(() => {
        const today = new Date().toISOString()
        return today.slice(0, 10)
    })
</script>

<template>
    <div class="create__header">Create Ticket</div>
    <div class="create__divider"></div>
    <div class="create__ticket ticket">
        <div class="ticket__row">
            <div class="ticket__label">Date</div>
            <div class="ticket__date">{{ currentDate }}</div>
        </div>
        <div class="ticket__row">
            <div class="ticket__label">Purpose</div>
            <div>Medical Reimbursement</div>
        </div>
        <div class="ticket__row">
            <div class="ticket__label">Office</div>
            <select class="ticket__office" v-model="office">
                <option value="">-- Please choose an office --</option>
                <option value="FEU Tech">FEU Tech</option>
                <option value="FEU Diliman">FEU Diliman</option>
                <option value="FEU Makati">FEU Makati</option>
                <option value="FEU Cavite">FEU Cavite</option>
                <option value="FEU High School">FEU High School</option>
                <option value="FEU Alabang">FEU Alabang</option>
                <option value="FEU Roosevelt">FEU Roosevelt</option>
            </select>
        </div>
        <div v-if="isOfficeEmpty" class="error">Please choose an office.</div>
        <div class="ticket__row">
            <div class="ticket__label">Department</div>
            <select class="ticket__department" v-model="department">
                <option value="">-- Please choose a department --</option>
                <option value="Multimedia Arts">Multimedia Arts</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Computer Engineering">Computer Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Electronics and Electrical Engineering">Electronics and Electrical Engineering</option>
                <option value="Mathematics and Physical Sciences">Mathematics and Physical Sciences</option>
                <option value="Humanities, Social Sciences, and Communication">Humanities, Social Sciences, and Communication</option>
            </select>
        </div>
        <div v-if="isDepartmentEmpty" class="error">Please choose a department.</div>
    </div>
</template>

<style scoped>
    .create__header {
        font-size: 2rem;
        font-weight: 700;
        padding: 1rem 0rem;
    }
    .create__divider {
        width: 100%;
        height: 1px;
        background-color: var(--neutral-200);
    }
    .ticket {
        margin: 3rem 0rem;
    }
    .ticket__row {
        display: flex;
        margin: 0.5rem 0rem;
        align-items: center;
    }
    .ticket__label {
        font-weight: 700;
        width: 8rem;
    }
    .ticket__office,
    .ticket__department {
        font: inherit;
        padding: 0.2rem;
        background-color: white;
        
    }
    input {
        font: inherit;
        padding: 0.2rem;
        width: 24rem;
    }
    .error {
        font-size: 0.8rem;
        color: var(--red-800);
    }
</style>