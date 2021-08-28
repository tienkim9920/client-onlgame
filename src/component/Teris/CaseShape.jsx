
// Hình vuông 5 6 17 18
export const checkSquare = (shape, colum) => {
    const one = shape[1] - shape[0] // kiểm tra đầu
    const two = shape[3] - shape[2] // kiểm tra cuối

    if (one === 1 && two === 1 && shape[2] - shape[0] === colum && shape[3] - shape[1] === colum) {
        return true
    }

    return false
}

// Hình nằm ngang ---- 5 6 7 8
export const checkHorizontal = (shape) => {
    let count = 0

    for (let i = 1; i < shape.length; i++) {
        if (shape[i] - shape[i - 1] === 1) {
            count++
        }
    }

    if (count === 3){
        return true
    }

    return false
}

// Hình thẳng đứng | 5 17 29 41
export const checkVerical = (shape, colum) => {
    let count = 0

    for (let i = 1; i < shape.length; i++){
        if (shape[i] - shape[i - 1] === colum){
            count++
        }
    }

    if (count === 3){
        return true
    }

    return false
}

// Hình xém vuông thứ nhất 5 6 16 17
//   5 6
// 1 2
export const checkHalfOne = (shape, colum) => {
    const one = shape[1] - shape[0] // kiểm tra đầu
    const two = shape[3] - shape[2] // kiểm tra cuối

    if (one === 1 && two === 1 && shape[2] - shape[0] === colum - 1 && shape[3] - shape[1] === colum - 1) {
        return true
    }

    return false
}

// Hình xém vuông thứ hai 5 6 18 19
// 5 6
//   1 2
export const checkHalfTwo = (shape, colum) => {
    const one = shape[1] - shape[0] // kiểm tra đầu
    const two = shape[3] - shape[2] // kiểm tra cuối

    if (one === 1 && two === 1 && shape[2] - shape[0] === colum + 1 && shape[3] - shape[1] === colum + 1) {
        return true
    }

    return false
}

// Hình xem vuông thứ ba 5 17 16 28
//    1
//  1 1
//  1
export const checkHalfThree = (shape, colum) => {
    const one = shape[1] - shape[0]
    const two = shape[3] - shape[2]

    if (one === colum && two === colum && shape[2] - shape[0] === colum - 1 && shape[3] - shape[1] === colum - 1){
        return true
    }

    return false
}

// Hình xem vuông thứ tư 5 17 18 30
//  1
//  1 1
//    1
export const checkHalfFour = (shape, colum) => {
    const one = shape[1] - shape[0]
    const two = shape[3] - shape[2]

    if (one === colum && two === colum && shape[2] - shape[0] === colum + 1 && shape[3] - shape[1] === colum + 1){
        return true
    }

    return false
}

// Hình T thứ nhất 5 16 17 18
//   4
// 1 2 3
export const checkTOne = (shape, colum) => {

    const one = shape[2] - shape[0]
    let count = 0
    for (let i = 1; i < shape.length; i++){
        if (shape[i + 1] - shape[i] === 1){
            count++
        }
    }

    if (count === 2 && one === colum){
        return true
    }

    return false
}

// Hình T thứ hai 5 16 17 29
//   4
// 1 2
//   3
export const checkTTwo = (shape, colum) => {
    const one = shape[2] - shape[0]
    const two = shape[3] - shape[1]

    if (one === colum && two === colum + 1){
        return true
    }

    return false
}

// Hình T thứ ba 4 5 6 17
// 4 5 6
//   3
export const checkTThree = (shape, colum) => {
    const one = shape[3] - shape[1]
    let count = 0

    for (let i = 1; i < shape.length; i++){
        if (shape[i] - shape[i - 1] === 1){
            count++
        }
    }

    if (count === 2 && one === colum){
        return true
    }

    return false
}

// Hình T thứ tƯ 5 17 18 29
//  4
//  2 1
//  3
export const checkTFour = (shape, colum) => {
    const one = shape[1] - shape[0]
    const two = shape[3] - shape[1]

    if (one === colum && two === colum){
        return true
    }

    return false
}