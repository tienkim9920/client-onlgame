
export const moveLeft = (row, colum) => {
    let array = []

    for(let i = 0; i < row; i++){
        array.push(i * colum)
    }

    return array
}

export const moveRight = (row, colum) => {
    let array = []

    for(let i = 0; i < row; i++){
        array.push(i * colum + colum - 1)
    }

    return array
}

export const rowLength = (row, colum) => {
    let array = []

    for (let i = 0; i < colum; i++){
        array.push(((row - 1) * colum) + i)
    }

    return array
}

export const rowStart = (colum) => {
    let array = []

    for (let i = 0; i < colum; i++){
        array.push(i)
    }

    return array
}