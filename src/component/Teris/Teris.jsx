import React from 'react';
import { motion } from 'framer-motion'
import './Teris.css'
import { useEffect } from 'react';
import SHAPE from './Shape'
import { useState } from 'react';
import { moveLeft, moveRight, rowLength } from './MoveBlock';

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

    useEffect(() => {

        ramdomTeris()

        // Hàm này dùng để bấm phím
        onTyping()

    }, [])

    useEffect(() => {
        // get colum
        const cell = document.querySelectorAll('[data-colum]')

        for (let i = 0; i < shape.length; i++) {
            removeIndex(shape[i])
        }

        shape.forEach(value => {
            cell[value].classList.add(color)
            cell[value].classList.add('checking')
        })

        const interval = setInterval(() => {
            moveDownTeris(12)
        }, 750)

        return () => clearInterval(interval)

    }, [shape])

    // Hàm này dùng để đánh dấu ô
    function placeChecking(shape) {
        const cell = document.querySelectorAll('[data-colum]')

        shape.forEach(index => {
            cell[index].classList.add('checking')
            cell[index].classList.add(color)
        })
    }

    // Kiểm tra quy luật
    function checkDown() {

        let count = 0

        for (let i = 1; i < shape.length; i++) {
            if (shape[i] - shape[i - 1] === 1) {
                count++
            }
        }

        return count

    }

    // Kiểm tra có phải hình vuông
    function checkSquare(colum) {

        const one = shape[1] - shape[0] // kiểm tra đầu
        const two = shape[3] - shape[2] // kiểm tra cuối

        if (one === 1 && two === 1 && shape[2] - shape[0] === colum && shape[3] - shape[1] === colum) {
            return true
        }

        return false

    }

    // Kiểm tra xem có phải hình xém vuông
    function checkShape(colum) {
        const one = shape[1] - shape[0] // kiểm tra đầu
        const two = shape[3] - shape[2] // kiểm tra cuối

        if (one === 1 && two === 1 && shape[2] - shape[0] === colum - 1 && shape[3] - shape[1] === colum - 1) {
            return true
        }

        return false
    }

    function getMax(array, max) {

        let flagMax = 0

        for (let i = 0; i < array.length; i++) {
            if (array[i] === max) {
                continue
            }
            if (flagMax < array[i]) {
                flagMax = array[i]
            }
        }

        return flagMax
    }

    useEffect(() => {

        if (move === 65) {
            moveLeftTeris(16, 12)
            setMove(null)
        } else if (move === 68) {
            moveRightTeris(16, 12)
            setMove(null)
        } else if (move === 83) {
            moveDownTeris(12)
            setMove(null)
        }

    }, [move])

    function onTyping() {
        document.addEventListener('keydown', (e) => {
            if (e.keyCode === 65) {
                setMove(65)
            } else if (e.keyCode === 231) {
                console.log("Route")
            } else if (e.keyCode === 68) {
                setMove(68)
            } else if (e.keyCode === 83) {
                setMove(83)
            }
        })
    }

    // Hàm này dùng để di chuyển left
    function moveLeftTeris(row, colum) {

        const posLeft = moveLeft(row, colum)

        // Kiểm tra xem thử vị trí của nó có hợp lệ để move hay không
        let flag = combination(posLeft, shape)

        if (!flag) {
            setValueShape(-1)
        }

    }

    // Hàm này dùng để di chuyển sang phải
    function moveRightTeris(row, colum) {
        const posRight = moveRight(row, colum)

        // Kiểm tra xem thử vị trí của nó có hợp lệ để move hay không
        let flag = combination(posRight, shape)

        if (!flag) {
            setValueShape(1)
        }
    }

    function moveDownTeris(colum) {
        // get colum
        const cell = document.querySelectorAll('[data-colum]')

        // Kiểm tra điều kiện trước
        const count = checkDown()
        const square = checkSquare(colum)
        const checking = checkShape(colum)

        console.log(count)
        console.log(square)
        console.log(checking)

        const arrayRow16 = rowLength(16, 12) // Lấy mảng dòng cuối cùng
        const flag = combination(arrayRow16, shape) // kiểm tra xem nó có đang ở dòng cuối cùng k

        if (flag) {
            placeChecking(shape)
            ramdomTeris()
            return
        }

        if (count === 3) { // trường hợp ngang 4 số liền nhau 5 6 7 8
            console.log('Hinh nam ngang')
            for (let i = 0; i < shape.length; i++) {
                if (cell[shape[i] + 12].classList.contains('checking')) {
                    placeChecking(shape)
                    ramdomTeris()
                    return
                }
            }
        } else if (count === 2 && !checking && square) { // trường hợp ô vuông 5 6 17 18
            console.log('Hinh vuong')
            for (let i = shape.length - 1; i > 1; i--){
                if (cell[shape[i] + 12].classList.contains('checking')) {
                    placeChecking(shape)
                    ramdomTeris()
                    return
                }
            }
        } else if (count === 2 && checking && !square) { // trường hợp 5 6 16 17
            console.log('hinh xem vuong')
            for (let i = 1; i < shape.length; i++){
                if (cell[shape[i] + 12].classList.contains('checking')) {
                    placeChecking(shape)
                    ramdomTeris()
                    return
                }
            }
        } else if (count === 2 && !checking && !square) { // trường hợp 3 số liền nhau 16 17 18
            console.log('hinh __|__, |___, ___|')
            for (let i = 1; i < shape.length; i++){
                if (cell[shape[i] + 12].classList.contains('checking')) {
                    placeChecking(shape)
                    ramdomTeris()
                    return
                }
            }
        } else { // extant
            console.log('Cac hinh khac')
            if (cell[shape[shape.length - 1] + 12].classList.contains('checking')) {
                placeChecking(shape)
                ramdomTeris()
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
                <div className="teris">
                    {
                        [...Array(192)].map((x, i) => (
                            <div key={i} data-colum className="colum"></div>
                        ))
                    }
                </div>
            </motion.div>
        </div>
    );
}

export default Teris;