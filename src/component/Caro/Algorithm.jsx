let WINNING_COMBINATIONS = []

matrixYX(11, WINNING_COMBINATIONS)
matrixCross(11, WINNING_COMBINATIONS)

// Hàm này dùng để khởi tạo tất cả các dòng có thể xảy ra trong mảng
function matrixYX(colum, arrMap){

    for (let i = 0; i < colum; i++){
        Horizontal(i, colum, arrMap)
        vertical(i, colum, arrMap)
    }

}

// Hàm này dùng để xử lý mạng theo chiều ngang
function Horizontal(row, colum, arrMap) {
    
    const getColum = setColum(colum)

    let arr = createArray(getColum)

    for (let j = 0; j < 5; j++){
        for (let i = 0; i < getColum; i++){

            arr[i][j] = i + (row * colum) + j
                
        }
    }

    pushArray(arr, arrMap)

}

// Hàm này dùng để xử lý mảng theo chiều dọc
function vertical(row, colum, arrMap) {

    const getColum = setColum(colum)

    let arr = createArray(getColum)

    for (let i = 0; i < getColum; i++){
        for (let j = 0; j < 5; j++){

            const value = (j * colum) + (i * colum) + row

            arr[i][j] = value

        }
    }

    pushArray(arr, arrMap)
    
}

// Hàm này dùng để xử lý mảng chéo
function caseRow(row, colum, arrMap){

    const getColum = setColum(colum)

    let arrLeft = createArray(getColum)

    let arrRight = createArray(getColum)

    for (let j = 0; j < 5; j++){
        for (let i = 0; i < getColum; i++){

            // Từ trái qua phải
            const valueLeft = j < 1 ? i + (row * colum) : (j * colum) + i + j + (row * colum)

            // Từ phải qua trái
            const valueRight = j < 1 ? 4 + i + (row * colum) : (j * colum) + i - j + (row * colum) + 4

            arrLeft[i][j] = valueLeft

            arrRight[i][j] = valueRight

        }
    }

    pushArray(arrLeft, arrMap)
    pushArray(arrRight, arrMap)

}

// // Hàm này dùng để push mảng con vào mảng cha
function pushArray(arrayChild, arrayParent) {
    for (let i = 0; i < arrayChild.length; i++){
        arrayParent.push(arrayChild[i])
    }
}

// Hàm này dùng để map cái những array vào mảng parent
function matrixCross(colum, arrMap){

    const getColum = setColum(colum)

    for (let i = 0; i < getColum; i++){
        caseRow(i, colum, arrMap)
    }
}

// Hàm này dùng để set colum nếu colum là số chẵn thì cộng 2 lẻ thì cộng 1
function setColum(colum) {
    if (colum > 10 && colum % 2 === 0){
        return Math.ceil(colum/2) + 2
    }else{
        return Math.ceil(colum/2) + 1
    }
}

// Hàm này dùng để tạo mảng rỗng 2 chiều
function createArray(colum){

    let array = []

    for(var i = 0; i < colum; i++){

        array.push([]);

        array[i].push(new Array(5));

        for(var j = 0; j < 5; j++){
            array[i][j] = 0;
        }
    }

    return array
}

export default WINNING_COMBINATIONS