import React from 'react';
import { motion } from 'framer-motion'
import './Tetris.css'
import { useEffect } from 'react';
import SHAPE from './Shape'
import { useState } from 'react';
import { moveLeft, moveRight, rowLength, rowStart } from './MoveBlock';
import { checkHalfFour, checkHalfOne, checkHalfThree, checkHalfTwo, checkHorizontal, checkLFour, checkLOne, checkLThree, checkLTwo, checkSquare, checkTFour, checkTOne, checkTThree, checkTTwo, checkVerical } from './CaseShape';

const containerVariants = {
    hidden: {
        opacity: 0,
        y: '5rem'
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', delay: 0.5 }
    },
    exit: {
        x: "-20vh",
        transition: { ease: 'easeInOut' }
    }
};

const COLOR = ['teris-red', 'teris-yellow', 'teris-green', 'teris-blue', 'teris-blueviolet', 'teris-darkgoldenrod']

function Teris(props) {

    const [shape, setShape] = useState([])

    const [color, setColor] = useState(null)

    const [move, setMove] = useState(null)

    const [score, setScore] = useState(0)

    const [restart, setRestart] = useState(false)

    useEffect(() => {

        ramdomTeris()

        // Hàm này dùng để bấm phím
        onTyping()

    }, [])

    useEffect(() => {

        if (shape){
            // get colum
            const cell = document.querySelectorAll('[data-colum]')

            shape.forEach(value => {
                cell[value].classList.add(color)
                cell[value].classList.add('checking')
            })

            const interval = setInterval(() => {
                moveDownTeris(12)
            }, 750)
        
            return () => clearInterval(interval)
        }

    }, [shape])

    const handlerRestart = (e) => {
        e.preventDefault()

        setRestart(false)

        const cell = document.querySelectorAll('[data-colum]')

        for (let i = 0; i < cell.length; i++){
            for (let j = 0; j < COLOR.length; j++){
                cell[i].classList.remove(COLOR[j])
            }
            cell[i].classList.remove('checking')
        }

        ramdomTeris()

        setMove(87)
    }

    // Hàm này dùng để đánh dấu ô và hạ khối hình xuống sau đó tính điểm
    function placeChecking(shape) {
        const cell = document.querySelectorAll('[data-colum]')

        shape.forEach(index => {
            cell[index].classList.add('checking')
            cell[index].classList.add(color)
        })

        const posStart = rowStart(12)
        const flag = combination(posStart, shape)

        if (flag){
            console.log("Ban da thua")
            setShape(null)
            setRestart(true)
            return
        }

        const row = 16
        const colum = 12
        // row * colum

        for (let i = 0; i < row; i++){
            
            let flag = 0

            // Kiểm tra xem dòng đó có chứa đầy đủ ô không
            for (let j = i * colum; j < i * colum + colum; j++){
                if (cell[j].classList.contains('checking')){
                    flag++
                }
            }

            // Có thì bắt đầu xóa
            if (flag === colum){
                console.log(flag)
                for (let j = i * colum; j < i * colum + colum; j++){
                    removeCheckingRow(j)
                }

                setScore(score + 10)

                // Xong hạ xuống
                lowerShape(i, 12)
            }
        }

        ramdomTeris()
    }

    // Hàm này dùng để xóa dòng hình đó
    function removeCheckingRow(index){
        const cell = document.querySelectorAll('[data-colum]')[index]

        for (let i = 0; i < COLOR.length; i++){
            cell.classList.remove(COLOR[i])
        }
        cell.classList.remove('checking')
    }

    // Hàm này dùng để hạ khối hình
    function lowerShape(position, colum){
        const cell = document.querySelectorAll('[data-colum]')
        
        for (let i = position; i > 0; i--){
            for (let j = i * colum; j < i * colum + colum; j++){

                // Kiểm tra xem ô ở phía trên là màu gì sau đó xóa đi và gán cho color
                for (let k = 0; k < COLOR.length; k++){
                    if (cell[j - colum].classList.contains(COLOR[k]) && cell[j - colum].classList.contains('checking')){
                        cell[j - colum].classList.remove('checking')
                        cell[j - colum].classList.remove(COLOR[k])

                        // tiến hành gán
                        cell[j].classList.add('checking')
                        cell[j].classList.add(COLOR[k])
                    }
                }
            }
        }
    }

    // Hàm này để gọi lại những function move
    useEffect(() => {

        if (shape){
            if (move === 65) {
                moveLeftTeris(16, 12)
                setMove(null)
            } else if (move === 87) {
                routeShape()
                setMove(null)
            } else if (move === 68) {
                moveRightTeris(16, 12)
                setMove(null)
            } else if (move === 83) {
                moveDownTeris(12)
                setMove(null)
            }
        }

    }, [move])

    function onTyping() {
        document.addEventListener('keydown', (e) => {
            if (e.keyCode === 65) {
                setMove(65)
            } else if (e.keyCode === 87) {
                setMove(87)
            } else if (e.keyCode === 68) {
                setMove(68)
            } else if (e.keyCode === 83) {
                setMove(83)
            }
        })
    }

    // Kiểm tra nhưng ô bên trái có tồn tại hay chưa
    function moveLeftExist(){
        const cell = document.querySelectorAll('[data-colum]') // 5 17 16 28

        const halfThree = checkHalfThree(shape, 12)

        if (halfThree){
            if (cell[shape[0] - 1].classList.contains('checking') || cell[shape[2] - 1].classList.contains('checking')
                || cell[shape[3] - 1].classList.contains('checking')){
                return true
            }
        }else{
            for (let i = 0; i < shape.length; i++){
                if (shape[i] - shape[i - 1] === 1)
                    continue
                if (cell[shape[i] - 1].classList.contains('checking')){
                    return true
                }
            }
        }

        return false
    }

    // Kiểm tra nhưng ô bên phải có tồn tại hay chưa
    function moveRightExist(){
        const cell = document.querySelectorAll('[data-colum]') // 5 17 16 28

        const halfThree = checkHalfThree(shape, 12)

        if (halfThree){
            if (cell[shape[0] + 1].classList.contains('checking') || cell[shape[1] + 1].classList.contains('checking')
                || cell[shape[3] + 1].classList.contains('checking')){
                return true
            }
        }else{
            for (let i = 0; i < shape.length; i++){
                if (shape[i + 1] - shape[i] === 1)
                    continue
                if (cell[shape[i] + 1].classList.contains('checking')){
                    return true
                }
            }
        }

        return false
    }

    // Hàm này dùng để bỏ check
    function deleteChecking(shape){
        for (let i = 0; i < shape.length; i++) {
            removeIndex(shape[i])
        }
    }

    function checkDown(shape){
        const arrayRow16 = rowLength(16, 12) // Lấy mảng dòng cuối cùng
        const flag = combination(arrayRow16, shape) // kiểm tra xem nó có đang ở dòng cuối cùng k

        if (flag) {
            return true
        }

        return false
    }

    function checkRight(shape){
        const posRight = moveRight(16, 12)
        let flag = combination(posRight, shape)
        
        if (flag) {
            return true
        }

        return false
    }

    function checkLeft(shape){
        const posLeft = moveLeft(16, 12)
        let flag = combination(posLeft, shape)
        
        if (flag) {
            return true
        }

        return false
    }

    // Hàm này dùng để xoay hình
    function routeShape(){
        // Kiểm tra xem nó thuộc hình nào
        const square = checkSquare(shape, 12)
        const horizontal = checkHorizontal(shape, 12)
        const verical = checkVerical(shape, 12)
        const halfOne = checkHalfOne(shape, 12)
        const halfTwo = checkHalfTwo(shape, 12)
        const halfThree = checkHalfThree(shape, 12)
        const halfFour = checkHalfFour(shape, 12)
        const TOne = checkTOne(shape, 12)
        const TTwo = checkTTwo(shape, 12)
        const TThree = checkTThree(shape, 12)
        const TFour = checkTFour(shape, 12)
        const LOne = checkLOne(shape, 12)
        const LTwo = checkLTwo(shape, 12)
        const LThree = checkLThree(shape, 12)
        const LFour = checkLFour(shape, 12)

        // Kiểm tra nếu nó ở hàng cuối cùng thì k cho nó xoay
        const flagEnd = checkDown(shape)
        if (flagEnd){
            return
        }

        if (horizontal) { // trường hợp ngang 4 số liền nhau 5 6 7 8 => 5 17 29 41

            const newShape = [shape[0], shape[1] + 11, shape[2] + 22, shape[3] + 33]

            // còn mảng này để kiểm tra trước khi xoay những ô đó tồn tại hay chưa
            const newCombination = [shape[1] + 11, shape[2] + 22, shape[3] + 33]

            // Trước khi xoay kiểm tra vị trí ở cuối có hợp lệ hay không
            const flagDown = checkDown(newCombination)
            if (flagDown){
                return
            }

            if (combinationCells(newCombination)){
                return
            }

            deleteChecking(shape)
            setShape(newShape)

        } else if (verical){ // 5 17 29 41 => 5 6 7 8

            const newShape = [shape[0], shape[1] - 11, shape[2] - 22, shape[3] - 33]

            // còn mảng này để kiểm tra trước khi xoay những ô đó tồn tại hay chưa
            const newCombination = [shape[1] - 11, shape[2] - 22, shape[3] - 33]
            
            // Trước khi xoay kiểm tra vị trí ở cuối có hợp lệ hay không
            const flagDown = checkDown(newCombination)
            if (flagDown){
                return
            }

            // Trước khi xoay kiểm tra vị trí bên phải có hợp lệ hay không
            const flagRight = checkLeft(newCombination)
            if (flagRight){
                return
            }
            
            if (combinationCells(newCombination)){
                return
            }

            deleteChecking(shape)
            setShape(newShape)

        } else if (square) { // trường hợp vuông 5 6 17 18
            return
        } else if (halfOne) { // trường hợp xém vuông thứ nhất 5 6 16 17 => 5 6 18 19

            const newShape = [shape[0], shape[1], shape[2] + 2, shape[3] + 2]

            // còn mảng này để kiểm tra trước khi xoay những ô đó tồn tại hay chưa
            const newCombination = [shape[2] + 2, shape[3] + 2] 

            // Trước khi xoay kiểm tra vị trí bên phải có hợp lệ hay không
            const flagRight = checkLeft(newCombination)
            if (flagRight){
                return
            }
        
            if (combinationCells(newCombination)){
                return
            }

            deleteChecking(shape)
            setShape(newShape)

        } else if (halfTwo) { // trường hợp xém vuông thứ hai 5 6 18 19 => 5 17 16 28

            const newShape = [shape[0], shape[1] + 11, shape[2] - 2, shape[3] + 9]

            // còn mảng này để kiểm tra trước khi xoay những ô đó tồn tại hay chưa
            const newCombination = [shape[1] + 11, shape[2] - 2, shape[3] + 9] 
            
            // Trước khi xoay kiểm tra vị trí bên phải có hợp lệ hay không
            const flagLeft = checkRight(newCombination)
            if (flagLeft){
                return
            }

            if (combinationCells(newCombination)){
                return
            }

            deleteChecking(shape)
            setShape(newShape)

        } else if (halfThree) { // trường hợp xém vuông thứ ba 5 17 16 28 => 5 17 18 30

            const newShape = [shape[0], shape[1], shape[2] + 2, shape[3] + 2]

            // còn mảng này để kiểm tra trước khi xoay những ô đó tồn tại hay chưa
            const newCombination = [shape[2] + 2, shape[3] + 2] 
            
            // Trước khi xoay kiểm tra vị trí bên phải có hợp lệ hay không
            const flagRight = checkLeft(newCombination)
            if (flagRight){
                return
            }

            if (combinationCells(newCombination)){
                return
            }

            deleteChecking(shape)
            setShape(newShape)

        } else if (halfFour){ // trường hợp xém vuông thứ tư 5 17 18 30 => 5 6 16 17

            const newShape = [shape[0], shape[1] - 11, shape[2] - 2, shape[3] - 13]

            // còn mảng này để kiểm tra trước khi xoay những ô đó tồn tại hay chưa
            const newCombination = [shape[1] - 11, shape[2] - 2] 
            
            // Trước khi xoay kiểm tra vị trí bên phải có hợp lệ hay không
            const flagLeft = checkRight(newCombination)
            if (flagLeft){
                return
            }

            if (combinationCells(newCombination)){
                return
            }

            deleteChecking(shape)
            setShape(newShape)

        } else if (TOne) { // trường hợp xém T thứ nhất 5 16 17 18 => 5 16 17 29

            const newShape = [shape[0], shape[1], shape[2], shape[3] + 11]

            // còn mảng này để kiểm tra trước khi xoay những ô đó tồn tại hay chưa
            const newCombination = [shape[3] + 11] 
            
            if (combinationCells(newCombination)){
                return
            }

            deleteChecking(shape)
            setShape(newShape)

        } else if (TTwo) { // trường hợp xém T thứ hai 5 16 17 29 => 4 5 6 17

            const newShape = [shape[0] - 1, shape[1] - 11, shape[2] - 11, shape[3] - 12]

            // còn mảng này để kiểm tra trước khi xoay những ô đó tồn tại hay chưa
            const newCombination = [shape[0] - 1, shape[2] - 11]

            const newCheck = [shape[2] - 11]

            // Trước khi xoay kiểm tra vị trí bên phải có hợp lệ hay không
            const flagRight = checkLeft(newCheck)
            if (flagRight){
                return
            }         
            
            if (combinationCells(newCombination)){
                return
            }

            deleteChecking(shape)
            setShape(newShape)

        } else if (TThree) { // trường hợp xém T thứ ba 4 5 6 17 =>  5 17 18 29

            const newShape = [shape[0] + 1, shape[1] + 12, shape[2] + 12, shape[3] + 12]

            // còn mảng này để kiểm tra trước khi xoay những ô đó tồn tại hay chưa
            const newCombination = [shape[2] + 12, shape[3] + 12] 
            
            if (combinationCells(newCombination)){
                return
            }

            deleteChecking(shape)
            setShape(newShape)

        } else if (TFour) { // trường hợp xém T thứ tu 5 17 18 29 => 5 16 17 18

            const newShape = [shape[0], shape[1] - 1, shape[2] - 1, shape[3] - 11]

            // còn mảng này để kiểm tra trước khi xoay những ô đó tồn tại hay chưa
            const newCombination = [shape[1] - 1]

            // Trước khi xoay kiểm tra vị trí bên phải có hợp lệ hay không
            const flagLeft = checkRight(newCombination)
            if (flagLeft){
                return
            }             
            
            if (combinationCells(newCombination)){
                return
            }

            deleteChecking(shape)
            setShape(newShape)

        } else if (LOne) { // trường hợp L thu nhat 5 17 18 19 => 5 6 17 29

            const newShape = [shape[0], shape[1] - 11, shape[2] - 1, shape[3] + 10] // Mảng này để lưu

            // còn mảng này để kiểm tra trước khi xoay những ô đó tồn tại hay chưa
            const newCombination = [shape[1] - 11, shape[3] + 10] 
            
            if (combinationCells(newCombination)){
                return
            }

            deleteChecking(shape)
            setShape(newShape)

        } else if (LTwo) { // trường hợp L thu hai 5 6 17 29 => 5 6 18 30

            const newShape = [shape[0], shape[1], shape[2] + 1, shape[3] + 1]

            // còn mảng này để kiểm tra trước khi xoay những ô đó tồn tại hay chưa
            const newCombination = [shape[2] + 1, shape[3] + 1]            

            if (combinationCells(newCombination)){
                return
            }

            deleteChecking(shape)
            setShape(newShape)

        } else if (LThree) { // trường hợp L thu ba 5 6 18 30 => 5 15 16 17

            const newShape = [shape[0], shape[1] + 9, shape[2] - 2, shape[3] - 13]

            // còn mảng này để kiểm tra trước khi xoay những ô đó tồn tại hay chưa
            const newCombination = [shape[1] + 9, shape[2] - 2, shape[3] - 13]

            // Trước khi xoay kiểm tra vị trí bên phải có hợp lệ hay không
            const flagLeft = checkRight(newCombination)
            if (flagLeft){
                return
            }

            if (combinationCells(newCombination)){
                return
            }

            deleteChecking(shape)
            setShape(newShape)

        } else if (LFour){ // trường hợp L thứ tu 5 15 16 17 => 5 17 18 19

            const newShape = [shape[0], shape[1] + 2, shape[2] + 2, shape[3] + 2]

            // còn mảng này để kiểm tra trước khi xoay những ô đó tồn tại hay chưa
            const newCombination = [shape[2] + 2, shape[3] + 2]   
            
            // Trước khi xoay kiểm tra vị trí bên phải có hợp lệ hay không
            const flagRight = checkLeft(newCombination)
            if (flagRight){
                return
            }            

            if (combinationCells(newCombination)){
                return
            }

            deleteChecking(shape)
            setShape(newShape)

        }
    }

    // Hàm này dùng để di chuyển left
    function moveLeftTeris(row, colum) {
        
        const posLeft = moveLeft(row, colum)

        // Kiểm tra xem thử vị trí của nó có hợp lệ để move hay không
        let flag = combination(posLeft, shape)

        if (!flag) {
            if (moveLeftExist()){
                return
            }
            setValueShape(-1)
        }

    }

    // Hàm này dùng để di chuyển sang phải
    function moveRightTeris(row, colum) {
        const posRight = moveRight(row, colum)

        // Kiểm tra xem thử vị trí của nó có hợp lệ để move hay không
        let flag = combination(posRight, shape)

        if (!flag) {
            if (moveRightExist()){
                return
            }
            setValueShape(1)
        }
    }

    // Hàm này dùng để kiểm tra khi di chuyển hình xuống
    function moveDownTeris(colum) {
        // get colum
        const cell = document.querySelectorAll('[data-colum]')

        // Kiểm tra xem nó thuộc hình nào
        const square = checkSquare(shape, 12)
        const horizontal = checkHorizontal(shape, 12)
        const verical = checkVerical(shape, 12)
        const halfOne = checkHalfOne(shape, 12)
        const halfTwo = checkHalfTwo(shape, 12)
        const halfThree = checkHalfThree(shape, 12)
        const halfFour = checkHalfFour(shape, 12)
        const TOne = checkTOne(shape, 12)
        const TTwo = checkTTwo(shape, 12)
        const TThree = checkTThree(shape, 12)
        const TFour = checkTFour(shape, 12)
        const LOne = checkLOne(shape, 12)
        const LTwo = checkLTwo(shape, 12)
        const LThree = checkLThree(shape, 12)
        const LFour = checkLFour(shape, 12)

        const arrayRow16 = rowLength(16, 12) // Lấy mảng dòng cuối cùng
        const flag = combination(arrayRow16, shape) // kiểm tra xem nó có đang ở dòng cuối cùng k

        if (flag) {
            placeChecking(shape)
            // ramdomTeris()
            return
        }

        if (horizontal) { // trường hợp ngang 4 số liền nhau 5 6 7 8
            // console.log('Hinh nam ngang')
            for (let i = 0; i < shape.length; i++) {
                if (cell[shape[i] + 12].classList.contains('checking')) {
                    placeChecking(shape)
                    // ramdomTeris()
                    return
                }
            }
        } else if (verical){ // trường hợp đứng 5 17 29 41
            if (cell[shape[3] + 12].classList.contains('checking')) {
                placeChecking(shape)
                // ramdomTeris()
                return
            }
        } else if (square) { // trường hợp vuông 5 6 17 18
            // console.log('Hinh vuong')
            for (let i = shape.length - 1; i > 1; i--){
                if (cell[shape[i] + 12].classList.contains('checking')) {
                    placeChecking(shape)
                    // ramdomTeris()
                    return
                }
            }
        } else if (halfOne) { // trường hợp xém vuông thứ nhất 5 6 16 17
            // console.log('hinh xem vuong thu 1')
            for (let i = 1; i < shape.length; i++){
                if (cell[shape[i] + 12].classList.contains('checking')) {
                    placeChecking(shape)
                    // ramdomTeris()
                    return
                }
            }
        } else if (halfTwo) { // trường hợp xém vuông thứ hai 5 6 18 19
            // console.log('hinh xem vuong thu 2')
            if (cell[shape[0] + 12].classList.contains('checking') || cell[shape[2] + 12].classList.contains('checking') || 
                cell[shape[3] + 12].classList.contains('checking')) {
                placeChecking(shape)
                // ramdomTeris()
                return
            }
        } else if (halfThree) { // trường hợp xém vuông thứ ba 5 17 16 28
            // console.log('hinh xem vuong thu 3')
            if (cell[shape[1] + 12].classList.contains('checking') || cell[shape[3] + 12].classList.contains('checking')) {
                placeChecking(shape)
                // ramdomTeris()
                return
            }
        } else if (halfFour){ // trường hợp xém vuông thứ tư 5 17 18 30
            // console.log('hinh xem vuong thu 4')
            if (cell[shape[1] + 12].classList.contains('checking') || cell[shape[3] + 12].classList.contains('checking')) {
                placeChecking(shape)
                // ramdomTeris()
                return
            }
        } else if (TOne) { // trường hợp xém T thứ nhất 5 16 17 18
            // console.log('hinh xem T thu 1')
            for (let i = 1; i < shape.length; i++){
                if (cell[shape[i] + 12].classList.contains('checking')) {
                    placeChecking(shape)
                    // ramdomTeris()
                    return
                }
            }
        } else if (TTwo) { // trường hợp xém T thứ hai 5 16 17 29
            // console.log('hinh xem T thu 2')
            if (cell[shape[1] + 12].classList.contains('checking') || cell[shape[3] + 12].classList.contains('checking')) {
                placeChecking(shape)
                // ramdomTeris()
                return
            }
        } else if (TThree) { // trường hợp xém T thứ ba 4 5 6 17
            // console.log('hinh xem T thu 3')
            if (cell[shape[0] + 12].classList.contains('checking') || cell[shape[2] + 12].classList.contains('checking')
                || cell[shape[3] + 12].classList.contains('checking')) {
                placeChecking(shape)
                // ramdomTeris()
                return
            }
        } else if (TFour) { // trường hợp xém T thứ tu 5 17 18 29
            // console.log('hinh xem T thu 4')
            for (let i = shape.length - 1; i > 1; i--){
                if (cell[shape[i] + 12].classList.contains('checking')) {
                    placeChecking(shape)
                    // ramdomTeris()
                    return
                }
            } 
        } else if (LOne || LFour) { // trường hợp L thu nhat 5 17 18 19 || // trường hợp L thứ tu 5 15 16 17
            // console.log('hinh xem L thu 1 || 4')
            for (let i = 1; i < shape.length; i++){
                if (cell[shape[i] + 12].classList.contains('checking')) {
                    placeChecking(shape)
                    // ramdomTeris()
                    return
                }
            }
        } else if (LTwo) { // trường hợp L thu hai 5 6 17 29
            // console.log('hinh xem L thu 2')
            if (cell[shape[1] + 12].classList.contains('checking') || cell[shape[3] + 12].classList.contains('checking')) {
                placeChecking(shape)
                // ramdomTeris()
                return
            } 
        } else if (LThree) { // trường hợp L thu ba 5 6 18 30
            // console.log('hinh xem L thu 3')
            if (cell[shape[0] + 12].classList.contains('checking') || cell[shape[3] + 12].classList.contains('checking')) {
                placeChecking(shape)
                // ramdomTeris()
                return
            } 
        }

        setValueShape(colum)

    }

    function setValueShape(soHang){
        let newShape = []

        for (let i = 0; i < shape.length; i++) {
            removeIndex(shape[i])
            newShape.push(shape[i] + soHang)
        }

        setShape(newShape)
    }

    // trước khi di chuyển phải xóa vị trí cũ
    function removeIndex(index) {
        // get colum
        const cell = document.querySelectorAll('[data-colum]')[index]

        cell.classList.remove(color)
        cell.classList.remove('checking')
    }

    function combination(pos, shape) {
        for (let i = 0; i < pos.length; i++) {
            for (let j = 0; j < shape.length; j++) {
                if (pos[i] === shape[j]) {
                    return true
                }
            }
        }

        return false
    }

    function combinationCells(shape){
        // get colum
        const cell = document.querySelectorAll('[data-colum]')

        const flag = shape.some(index => {
            return cell[index].classList.contains('checking')
        })

        return flag
    }

    // Hàm này dùng để random hình
    function ramdomTeris() {
        //random color
        setColor(COLOR[Math.floor(Math.random() * COLOR.length)])

        // random shape
        setShape(SHAPE[Math.floor(Math.random() * SHAPE.length)])
    }

    return (
        <div className="layout-section-teris container">
            <motion.div className="wrapper-teris"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <div className="tetris">
                    {
                        [...Array(192)].map((x, i) => (
                            <div key={i} data-colum className="colum"></div>
                        ))
                    }
                    {
                        restart && (<div className="restart-tetris">
                            <input onClick={handlerRestart} className="btn-restart-tetris" type="submit" value="Chơi lại" />
                        </div>)
                    }
 
                </div>
                <div className="guide">
                    <div className="group-guide-header">
                        <h4>Hướng dẫn</h4>
                    </div>
                    <div className="group-guide-play">
                        <div className="d-flex justify-content-center">
                            <div className="guide-typing">W</div>
                        </div>
                        <div className="d-flex justify-content-center mt-2">
                            <div className="guide-typing typing-A">A</div>
                            <div className="guide-typing typing-S">S</div>
                            <div className="guide-typing typing-D">D</div>
                        </div>
                    </div>
                    <div className="description">
                        <div>W: Đổi hình</div>
                        <div>A: Di chuyển trái</div>
                        <div>S: Di chuyển phải</div>
                        <div>D: Di chuyển xuống</div>
                    </div>
                    <div className="score-tetris">
                        <div className="score-tetris-title">Điểm</div>
                        <div className="score-tetris-detail">{score}</div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default Teris;