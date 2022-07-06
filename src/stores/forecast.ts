import { defineStore } from "pinia"
import type { Ticket } from "@/types"

export const useForecastStore = defineStore({
    id: "forecast",
    state: () => ({
        startDate: null as null | Date,
        endDate: null as null | Date,
        testEmployees: 0,
        testDays: 0,
        qOneLower: 0,
        qOneUpper: 0,
        qTwoLower: 0,
        qTwoUpper: 0,
        qThreeLower: 0,
        qThreeUpper: 0,
        qFourLower: 0,
        qFourUpper: 0,
        actualStart: null as null | Date,
        actualEnd: null as null | Date,
        actualEmployees: 0,
        tickets: null as null | Ticket[]
    })
})