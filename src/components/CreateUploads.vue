<script setup lang="ts">
    import { storeToRefs } from "pinia"
    import { useCreateStore } from "@/stores/create"

    const store = useCreateStore()
    const { files, isUploadEmpty } = storeToRefs(store)

    function handleImageUpload(e: Event) {
        const element = e.currentTarget as HTMLInputElement
        const fileList: FileList | null = element.files

        if (fileList) {
            files.value = fileList
        }
    }
</script>

<template>
    <div class="uploads">
        <div class="uploads__header">Upload Receipt/Prescription</div>
        <label for="uploads__input" class="uploads__action">
            <div v-if="!files" class="uploads__icon"></div>
            <div v-if="!files">Click here to choose.</div>
            <div v-if="!files">You can choose more than one at the same time.</div>
            <div v-if="files">Click here again to change</div>
            <div v-if="files" class="uploads__filename" v-for="file in files">{{ file.name}}</div>
            <input type="file" id="uploads__input" @change="handleImageUpload($event)" multiple/>                
        </label> 
        <div v-if="isUploadEmpty" class="error">No uploads found. Please upload receipt/prescription.</div>           
    </div>
</template>

<style scoped>
    .uploads__header {
        font-size: 1.2rem;
        font-weight: 700;
    }
    #uploads__input {
        display: none;
    }
    .uploads__icon {
        background-image: url('../assets/plus.svg');
        background-size: contain;
        width: 2rem;
        height: 2rem;
        margin: 2rem;
    }
    .uploads__action {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border: 1px dashed var(--neutral-700);
        width: fit-content;
        padding: 2rem;
        margin: 2rem 0rem;
        cursor: pointer;
    }
    .error {
        font-size: 0.8rem;
        color: var(--red-800);
    }
</style>