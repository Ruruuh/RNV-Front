<script setup lang="ts">
import { ref } from "vue"
import { storeToRefs } from "pinia"
import { useForecastStore } from "@/stores/forecast"
import { getTestTrainingData, getMonthsAndDays } from "@/helpers/forecast"
import * as Plot from "@observablehq/plot"

const store = useForecastStore()
const {
    startDate,
    endDate,
    testEmployees,
    testDays,
    qOneLower,
    qOneUpper,
    qTwoLower,
    qTwoUpper,
    qThreeLower,
    qThreeUpper,
    qFourLower,
    qFourUpper
} = storeToRefs(store)

const display = ref<HTMLElement>()
const isModalShown = ref<boolean>(false)

function getLimits() {
    const limits = {
        qOneLower: qOneLower.value,
        qOneUpper: qOneUpper.value,
        qTwoLower: qTwoLower.value,
        qTwoUpper: qTwoUpper.value,
        qThreeLower: qThreeLower.value,
        qThreeUpper: qThreeUpper.value,
        qFourLower: qFourLower.value,
        qFourUpper: qFourUpper.value
    }
    return limits
}

function getChartInput() {
    const limits = getLimits()
    const data = getTestTrainingData(limits, testEmployees.value, testDays.value)
    console.log(data)

    const net = new brain.NeuralNetwork()
    const output = net.train(data)
    console.log(output)

    const chartInput: null | {}[] = []

    const dates = getMonthsAndDays(startDate.value as Date, endDate.value as Date)

    dates.forEach(date => {
        const result = net.run([parseInt(date.substring(0, 2)) / 12, parseInt(date.substring(3, 5)) / 31])
        const updatedDate = "2022-" + date
        chartInput.push({
            Date: updatedDate,
            Count: result[0] * testEmployees.value
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
            Plot.line(input, { x: "Date", y: "Count" })
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

function updateIsModalShown() {
    isModalShown.value = !isModalShown.value
}
</script>

<template>
    <div class="forecast__test">
        <div class="forecast__header">
            <div class="forecast__header-title">Forecasts</div>
            <div @click="updateIsModalShown" class="forecast__help"></div>
        </div>
        <div class="forecast__divider"></div>
        <div class="forecast__title">Test Forecast</div>
        <div class="forecast__date">
            <label for="forecast__start">Start Date</label>
            <input type="date" v-model="startDate" id="forecast__start" />
        </div>
        <div class="forecast__date">
            <label for="forecast__start">End Date</label>
            <input type="date" v-model="endDate" id="forecast__end" />
        </div>
        <div class="forecast__amount">
            <label for="forecast__employees">Number of Employees</label>
            <input type="number" v-model="testEmployees" id="forecast__employees" />
        </div>
        <div class="forecast__amount">
            <label for="forecast__days">Number of Days</label>
            <input type="number" v-model="testDays" id="forecast__days" />
        </div>
        <div class="forecast__range">
            <label for="forecast__range">First Quarter</label>
            <input type="number" v-model="qOneLower" id="forecast__range" />
            <input type="number" v-model="qOneUpper" id="forecast__range" />
        </div>
        <div class="forecast__range">
            <label for="forecast__range">Second Quarter</label>
            <input type="number" v-model="qTwoLower" id="forecast__range" />
            <input type="number" v-model="qTwoUpper" id="forecast__range" />
        </div>
        <div class="forecast__range">
            <label for="forecast__range">Third Quarter</label>
            <input type="number" v-model="qThreeLower" id="forecast__range" />
            <input type="number" v-model="qThreeUpper" id="forecast__range" />
        </div>
        <div class="forecast__range">
            <label for="forecast__range">Fourth Quarter</label>
            <input type="number" v-model="qFourLower" id="forecast__range" />
            <input type="number" v-model="qFourUpper" id="forecast__range" />
        </div>
        <base-button @click="getPlot" mode="dark">Forecast</base-button>
        <div class="forecast__title">Test Forecast Output</div>
        <div class="forecast__display" ref="display">
            <div class="forecast__placeholder">Forecast using test data will show up here.</div>
        </div>
    </div>
    <Teleport to="#app">
        <base-modal v-if="isModalShown">
                <div class="forecast__close-wrapper">
                    <div @click="updateIsModalShown" class="forecast__close"></div>
                </div>
            <div class="forecast__modal">
                <div class="modal__title">Forecast Output</div>
                <img class="modal__graph" src="../assets/graph.png"/>
                <div class="modal__title">Forecast Definitions</div>
                <div class="modal__row">
                    <div class="modal__word">Test Forecast</div>
                    <div class="modal__desc">Why make a test forecast? This is because a forecast is as good as the data used to train it. The amount of data in the system can be lacking. We want to make sure that our forecasting model works.</div>
                </div>
                <div class="modal__row">
                    <div class="modal__word">Actual Forecast</div>
                    <div class="modal__desc">This uses the actual data within the system.</div>
                </div>
                <div class="modal__title">How do we test?</div>
                <div class="modal__row">
                    <div class="modal__desc">We generate random test data. We place limits on the randomly generated data. We try to make a forecast using this data. If the ouput graph matches the limits on our data, it means that the training model works.</div>
                </div>
                <div class="modal__title">Input Definitions</div>
                <div class="modal__row">
                    <div class="modal__word">Start Date</div>
                    <div class="modal__desc">This is the date when you want the output graph to start.</div>
                </div>
                <div class="modal__row">
                    <div class="modal__word">End Date</div>
                    <div class="modal__desc">This is the date when you want the output graph to end.</div>
                </div>
                <div class="modal__row">
                    <div class="modal__word">Number of Employees</div>
                    <div class="modal__desc">This is the number of employees you want the model to consider.</div>
                </div>
                <div class="modal__row">
                    <div class="modal__word">Number of Days</div>
                    <div class="modal__desc">This is the number of random data generated. A single piece of data contains an input and output. The input is the date. The output is the number of people making a ticket on that date.</div>
                </div>
                <div class="modal__row">
                    <div class="modal__word">First Quarter</div>
                    <div class="modal__desc">This is the upper and lower limit of the random precentage of employees generated as output for the first quarter. For example, we want only 20 to 40 percent of employees to make a request to the system from January to March. To enforce that, we place 20 on the left and 40 on the right of the 'First Quarter' input.</div>
                </div>
                <div class="modal__row">
                    <div class="modal__word">Second Quarter</div>
                    <div class="modal__desc">This is the upper and lower limit of the random precentage of employees generated as output for the second quarter.</div>
                </div>
                <div class="modal__row">
                    <div class="modal__word">Third Quarter</div>
                    <div class="modal__desc">This is the upper and lower limit of the random precentage of employees generated as output for the third quarter.</div>
                </div>
                <div class="modal__row">
                    <div class="modal__word">Fourth Quarter</div>
                    <div class="modal__desc">This is the upper and lower limit of the random precentage of employees generated as output for the fourth quarter.</div>
                </div>
            </div>
        </base-modal>
    </Teleport>
</template>

<style scoped>
.forecast {
    width: 900px;
}

.forecast__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.forecast__header-title {
    font-size: 2rem;
    font-weight: 700;
    padding: 1rem 0;
}

.forecast__help {
    background-image: url("../assets/help.svg");
    background-size: cover;
    width: 2rem;
    height: 2rem;
    cursor: pointer;
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
.forecast__amount,
.forecast__range {
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
#forecast__days,
#forecast__range {
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

.forecast__modal {
    width: 50vw;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    letter-spacing: 1px;
    overflow: auto;
}
.forecast__close-wrapper {
    display: flex;
    justify-content: flex-end;
}
.forecast__close {
    background-image: url("../assets/close.svg");
    background-size: cover;
    width: 1.5rem;
    height: 1.5rem;
    cursor: pointer;
}

.modal__graph {
    max-width: 100%;
}

.modal__title {
    font-size: 1.5rem;
    font-weight: 700;
}
.modal__word {
    font-size: 1.2rem;
    font-weight: 700;
}
</style>