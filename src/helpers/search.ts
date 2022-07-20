const getShiftObj = (pattern: string) => {
    const patternLength = pattern.length
    const shiftObj: { [key: string]: number } = {}

    for (let i = 0; i < patternLength; i++) {
        if (i === patternLength - 1) {
            shiftObj[pattern[i]] = patternLength
        } else {
            shiftObj[pattern[i]] = patternLength - i - 1
        }
    }

    return shiftObj
}

const getNewIndex = (pattern: string, text: string, shift: number) => {
    let initialIndex = pattern.length - 1
    let shiftedIndex = shift + initialIndex

    while(pattern[initialIndex] === text[shiftedIndex]) {
        initialIndex -= 1
        shiftedIndex -= 1
    }

    return shiftedIndex
}

const getShift = (obj: { [key: string]: number }, pattern: string, text: string, index: number) => {
    if ( Object.keys(obj). includes(text[index]) ) {
        return obj[text[index]]
    } else {
        return obj[pattern[pattern.length - 1]]
    }
}

export const search = (pattern: string, text: string)  => {
    const shiftObj = getShiftObj(pattern)
    let shift = 0
    let textSubstr = text.substring(0, pattern.length)

    while (pattern !== textSubstr) {
        const newIndex = getNewIndex(pattern, text, shift)
        shift += getShift(shiftObj, pattern, text, newIndex)
        
        if (shift > text.length - 4) {
            shift = -1
            return shift
        }

        textSubstr = text.substring(shift, shift + pattern.length)
    }

    return shift
}

export const searchMultiple = (pattern: string, text: string)  => {
    const shiftObj = getShiftObj(pattern)
    let shift = 0
    let textSubstr = text.substring(0, pattern.length)

    const indexArr: number[] = []

    while (shift < text.length - pattern.length) {
        if (pattern === textSubstr) {
            indexArr.push(shift)
            shift += pattern.length 
        }

        const newIndex = getNewIndex(pattern, text, shift)
        shift += getShift(shiftObj, pattern, text, newIndex)

        textSubstr = text.substring(shift, shift + pattern.length)
    }

    return indexArr 
}