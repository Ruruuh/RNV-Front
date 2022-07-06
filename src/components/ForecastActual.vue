<script setup lang="ts">
    import { ref, onBeforeMount, toDisplayString } from "vue"
    import { storeToRefs } from "pinia"
    import { useUserStore } from "@/stores/user"
    import { useForecastStore } from "@/stores/forecast"
    import { getActualTrainingData, getMonthsAndDays } from "@/helpers/forecast"
    import { secureGetReq } from "@/helpers/fetch"
    import * as Plot from "@observablehq/plot"
    import type { Ticket } from "@/types"

    const userstore = useUserStore()
    const forecaststore = useForecastStore()

    const { token } = storeToRefs(userstore)
    const { tickets, actualStart, actualEnd, actualEmployees } = storeToRefs(forecaststore)

    const display = ref<HTMLElement>()

    async function getAllTickets() {
        const url = "/api/tickets"
        const ticketsRes = await secureGetReq(url, token.value as string)
        tickets.value = ticketsRes
    }

    function getChartInput() {
        const data = getActualTrainingData(tickets.value as Ticket[], actualEmployees.value)
        console.log(data)

        const net = new brain.NeuralNetwork()
        const output = net.train(data)
        console.log(output)

        const chartInput: null | {}[] = []

        const dates = getMonthsAndDays(actualStart.value as Date, actualEnd.value as Date)

        dates.forEach(date => {
            const result = net.run([parseInt(date.substring(0, 2))/12, parseInt(date.substring(3, 5))/31])
            const updatedDate = "2022-" + date
            chartInput.push({
                Date: updatedDate,
                Count: result[0] * actualEmployees.value
            })
        })

        return chartInput
    }

    function getPlot() {
        const input = getChartInput()
        console.log(input)
        const nnPlot = Plot.plot({
            x: {
                type: "utc"
            },
            y: {
                grid: true
            },
            marks: [
                Plot.line(input, {x: "Date", y: "Count"})
            ],
            width: 900,
            height: 562.5
        })
        if (display.value?.firstChild) {
            display.value?.removeChild(display.value?.firstChild)
            display.value?.appendChild(nnPlot)
        } else {
            display.value?.appendChild(nnPlot)
        }
    }

    onBeforeMount(() => {
        getAllTickets()
    })
</script>

<template>
    <div class="forecast__actual">
        <div class="forecast__title">Actual Forecast</div>
        <div class="forecast__date">
            <label for="forecast__start">Start Date</label>
            <input type="date" v-model="actualStart" id="forecast__start"/>
        </div>
        <div class="forecast__date">
            <label for="forecast__start">End Date</label>
            <input type="date" v-model="actualEnd" id="forecast__end"/>
        </div>
        <div class="forecast__amount">
            <label for="forecast__employees">Number of Employees</label>                
            <input type="number" v-model="actualEmployees" id="forecast__employees"/>
        </div>
        <base-button @click="getPlot" mode="dark">Forecast</base-button>
        <div class="forecast__title">Actual Forecast Output</div>
        <div class="forecast__display" ref="display">
            <div class="forecast__placeholder">Forecast using actual data will show up here.</div>
        </div>
    </div>
</template>

<style scoped>
    .forecast {
        width: 900px;
    }
    .forecast__header {
        font-size: 2rem;
        font-weight: 700;
        padding: 1rem 0rem;
    }
    .forecast__divider {
        width: 100%;
        height: 1px;
        background-color: var(--neutral-200);
    }
    .forecast__title {
        font-size: 1.5rem;
        font-weight: 700;
        padding: 0.8rem 0rem;
    }
    .forecast__date,
    .forecast__amount {
        display: flex;
        align-items: center;
        padding: 0.5rem 0rem;
        gap: 2rem;
    }
    #forecast__start,
    #forecast__end {
        width: 10rem;
    }
    #forecast__employees,
    #forecast__days {
        width: 5rem;
    }
    input {
        font: inherit;
        padding: 0.2rem;
        width: 24rem;
        text-align: center;
    }
    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button {
        appearance: none;
    }
    label {
        font-weight: 700;
        width: 12rem;
    }
    .forecast__display {
        width: 900px;
        height: 600px;
    }
    .forecast__placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px dashed var(--neutral-700);
    }
</style>