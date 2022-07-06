<script setup lang="ts">
    import ForecastTest from "@/components/ForecastTest.vue"
    import ForecastActual from "@/components/ForecastActual.vue"
    import { onBeforeMount, onMounted } from "vue" 
    import nprogress from "nprogress"

    onBeforeMount(() => {
        nprogress.start()
    })
    onMounted(() => {
        nprogress.done()
    })
</script>

<template>
    <section class="forecast">
        <forecast-test></forecast-test>
        <forecast-actual></forecast-actual>
    </section>
</template>
