import type { Ticket } from "@/types"

const getDatesInBetween = (startDate: Date, endDate: Date) => {
    let dates: null | string[] = []

    const start = new Date(new Date(startDate).setUTCHours(0, 0, 0, 0))
    const end = new Date(new Date(endDate).setUTCHours(0, 0, 0, 0))

    const date = new Date(start.getTime())

    while (date < end) {
        let newDate = new Date(date)
        dates.push(newDate.toISOString())
        date.setDate(date.getDate() + 1)
    }

    return dates  
}

export const getMonthsAndDays = (startDate: Date, endDate: Date) => {
    const dates = getDatesInBetween(startDate, endDate)
    const newDates: null | string[] = []
    dates.forEach(date => {
        newDates.push(date.substring(5, 10))
    })
    return newDates   
}

const getRandomNumber = (min: number, max: number) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min  
}

const getRange = (
    month: number, 
    limits: {
        qOneLower: number,
        qOneUpper: number,
        qTwoLower: number,
        qTwoUpper: number,
        qThreeLower: number,
        qThreeUpper: number,
        qFourLower: number,
        qFourUpper: number,
    }, 
    employees: number) => {
 
    if (month <= 3/12) {
        const outputRange = {
            lowerLimit: limits.qOneLower * employees / 100,
            upperLimit: limits.qOneUpper * employees / 100
        }
        return outputRange
    } else if (month > 3/12 && month <= 6/12) {
        const outputRange = {
            lowerLimit: limits.qTwoLower * employees / 100,
            upperLimit: limits.qTwoUpper * employees / 100
        }
        return outputRange
    } else if (month > 6/12 && month <= 9/12) {
        const outputRange = {
            lowerLimit: limits.qThreeLower * employees / 100,
            upperLimit: limits.qThreeUpper * employees / 100
        }
        return outputRange
    } else {
        const outputRange = {
            lowerLimit: limits.qFourLower * employees / 100,
            upperLimit: limits.qFourUpper * employees / 100
        }
        return outputRange            
    }
}

export const getTestTrainingData = (
    limits: {
        qOneLower: number,
        qOneUpper: number,
        qTwoLower: number,
        qTwoUpper: number,
        qThreeLower: number,
        qThreeUpper: number,
        qFourLower: number,
        qFourUpper: number,
    }, 
    employees: number,
    days: number) => {
        const data: null | {}[] = []

        console.log(limits, employees, days)
        for (let i = 0; i < days; i++) {
            const randomMonth = (1/12) * getRandomNumber(1, 12)
            const randomDay = (1/31) * getRandomNumber(1, 31)
            const range = getRange(randomMonth, limits, employees)
            const randomOutput = (1/employees) * getRandomNumber(range.lowerLimit, range.upperLimit)
            console.log(randomOutput)

            data.push({
                input: [randomMonth, randomDay],
                output: [randomOutput]
            })
        }

        return data 
    }

export const getActualTrainingData = (tickets: Ticket[], employees: number) => {
    const countObj = {}

    tickets.forEach(ticket => {
        const month = ticket.createdAt.toString().substring(5, 7)
        const day = ticket.createdAt.toString().substring(8, 10)
        const date = month + day
        if (!countObj[date]) {
            countObj[date] = 1
        } else {
            countObj[date] += 1
        }
    })

    const data: null | {}[] = []
    
    const dates = Object.keys(countObj)

    let maxValue = 0

    dates.forEach(date => {
        if (maxValue === 0) {
            maxValue = countObj[date]
        } else if (countObj[date] > maxValue) {
            maxValue = countObj[date]
        }
    })

    dates.forEach(date => {
        const month = date.substring(0,2)
        const day = date.substring(2, 4)

        data.push({
            input: [parseInt(month)/12, parseInt(day)/31],
            output: [countObj[date] / employees]
        })
    })

    return data
}