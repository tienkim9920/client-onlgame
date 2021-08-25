export const checkX = (array) => {
    for (let i = 1; i < array.length; i++) {
        if (array[i] - array[i - 1] !== 1) {
            return false
        }
    }
    return true
}

export const checkY = (array, maTrix) => {
    for (let i = 1; i < array.length; i++){
        if (array[i] - array[i - 1] !== maTrix){
            return false
        }
    }
    return true
}

export const checkLeftToRight = (array, maTrix) => {
    for (let i = 1; i < array.length; i++){
        if (array[i] - array[i - 1] !== maTrix + 1){
            return false
        }
    }
    return true
}

export const checkRightToLeft = (array, maTrix) => {
    for (let i = 1; i < array.length; i++){
        if (array[i] - array[i - 1] !== maTrix - 1){
            return false
        }
    }
    return true
}

export const blockX = (array, cellElements) => {

    const start = array[0]
    const end = array[array.length - 1]

    const store = [start - 1, end + 1]

    return checkingBlock(store, cellElements)
    
}

export const blockY = (array, maTrix, cellElements) => {

    const start = array[0]
    const end = array[array.length - 1]

    const store = [start - maTrix, end + maTrix]

    return checkingBlock(store, cellElements)

}

export const blockLeftToRight = (array, maTrix, cellElements) => {
    const start = array[0]
    const end = array[array.length - 1]

    const store = [start - maTrix - 1, end + maTrix + 1]

    return checkingBlock(store, cellElements)
}

export const blockRightToLeft = (array, maTrix, cellElements) => {
    const start = array[0]
    const end = array[array.length - 1]

    const store = [start - maTrix + 1, end + maTrix - 1]

    return checkingBlock(store, cellElements)
}

function checkingBlock(store, cellElements){
    let flag = 0

    store.forEach(value => {
        if (cellElements[value].classList.contains('x') || cellElements[value].classList.contains('o')){
            flag++
        }
    })

    if (flag < 2){
        return true
    }else{
        return false
    }
}