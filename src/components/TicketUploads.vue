<script setup lang="ts">
import { computed, ref } from "vue"
import { storeToRefs } from "pinia"
import { useTicketStore } from "@/stores/ticket"

const ticketStore = useTicketStore()

const { ticket } = storeToRefs(ticketStore)

const index = ref(0)
const width = ref(900)
const isImgModalShown = ref(false)

const src = computed(() => {
    const images = ticket.value?.images
    if (images) {
        return images[index.value].link
    } else {
        return ""
    }
})

function zoomIn() {
    width.value += 50 
}

function zoomOut() {
    width.value -= 50 
}

function goRight() {
    if (index.value + 1 === ticket.value?.images.length) {
        index.value = 0
    } else {
        index.value += 1
    }
}

function goLeft() {
    if (index.value - 1 === -1) {
        if (ticket.value?.images) {
            index.value = ticket.value.images.length - 1
        }
    } else {
        index.value -= 1
    }
}

function updateIsImgModalShown() {
    isImgModalShown.value = !isImgModalShown.value
}
</script>

<template>
    <div class="uploads__divider"></div>
    <div class="uploads">
        <div class="uploads__header">Uploaded Receipt/Prescription</div>
        <div class="uploads__carousel">
            <img :src="src" class="uploads__img" @click="updateIsImgModalShown"/>
            <div class="uploads__controls">
                <div class="uploads__left">
                    <div @click="goLeft" class="uploads__icon-left"></div>
                </div>
                <div class="uploads__indicators">
                    <div :class="i === index ? 'dark' : 'light'" v-for="(image, i) in ticket?.images"></div>
                </div>
                <div @click="goRight" class="uploads__right">
                    <div class="uploads__icon-right"></div>
                </div>
            </div>
        </div>
    </div>
    <Teleport to="#app">
        <base-modal v-if="isImgModalShown">
            <div class="modal__uploads">
                <div class="modal__header">
                    <div @click="zoomOut" class="modal__zoomOut"></div>
                    <div @click="zoomIn" class="modal__zoomIn"></div>
                    <div @click="updateIsImgModalShown" class="modal__close"></div>
                </div>
                <div class="modal__divider"></div>
                <div class="modal__img-wrapper">
                    <img :src="src" class="modal__img" :width="width" />
                </div>
            </div>
        </base-modal>
    </Teleport>
</template>

<style scoped>
.uploads__divider {
    width: 100%;
    height: 1px;
    background-color: var(--neutral-200);
    margin: 1rem 0rem;
}

.uploads {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.uploads__header {
    font-size: 1.5rem;
    font-weight: 700;
}

.uploads__img {
    max-width: 900px;
    margin: 2rem 0rem;
    cursor: pointer;
}

.uploads__carousel {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.uploads__controls {
    display: flex;
    align-items: center;
}

.uploads__icon-left {
    background-image: url("../assets/chevron-left.svg");
    cursor: pointer;
}

.uploads__icon-right {
    background-image: url("../assets/chevron-right.svg");
    cursor: pointer;
}

.uploads__icon-left,
.uploads__icon-right {
    background-size: cover;
    width: 2rem;
    height: 2rem;
}

.uploads__indicators {
    display: flex;
    gap: 1rem;
}

.dark {
    background-color: var(--neutral-700);
}

.light {
    background-color: var(--neutral-200);
}

.dark,
.light {
    width: 0.8rem;
    height: 0.8rem;
}

.modal__uploads {
    max-width: 60vw;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.modal__header {
    display: flex;
    justify-content: space-between;
    margin: 0.8rem 0rem;
}

.modal__zoomIn {
    background-image: url("../assets/zoom-in.svg");
    background-size: cover;
    width: 1.5rem;
    height: 1.5rem;
    cursor: pointer;
}

.modal__zoomOut {
    background-image: url("../assets/zoom-out.svg");
    background-size: cover;
    width: 1.5rem;
    height: 1.5rem;
    cursor: pointer;
}

.modal__close {
    background-image: url("../assets/close.svg");
    background-size: cover;
    width: 1.5rem;
    height: 1.5rem;
    cursor: pointer;
}

.modal__divider {
    width: 100%;
    height: 1px;
    background-color: var(--neutral-200);
    margin: 1rem 0rem;
}

.modal__img-wrapper {
    overflow: scroll
}

.modal__img {
    height: auto;
}

.error {
    font-size: 0.8rem;
    color: var(--red-800);
    margin: 2rem 0rem;
}
</style>