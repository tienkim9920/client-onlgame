import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import './Snake.css'
import { useEffect } from 'react';
import { moveLeft, moveRight, rowLength, rowStart } from '../Tetris/MoveBlock';

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

function Snake(props) {

    const [score, setScore] = useState(0)

    const [restart, setRestart] = useState(false)

    const [start, setStart] = useState(false)

    const [food, setFood] = useState(null)

    const [body, setBody] = useState(76)

    const [move, setMove] = useState(null)

    const [direct, setDirect] = useState('left')

    const [level, setLevel] = useState(null)

    const [play, setPlay] = useState(null)

    useEffect(() => {

        if (play) {
            randomFood()

            onTyping()
        }

    }, [play])

    useEffect(() => {

        if (play) {

            if (restart) {
                return
            }

            const cell = document.querySelectorAll('[data-colum-snake]')

            cell[body].classList.add('move')

            const interval = setInterval(() => {
                moveBody()
            }, level)

            return () => clearInterval(interval)
        }

    }, [body, play])

    // Hàm này dùng để di chuyển
    function moveBody() {

        const cell = document.querySelectorAll('[data-colum-snake]')

        if (cell[body].classList.contains('food')){

            cell[body].classList.remove('food')

            randomFood()

            setScore(score + 10)
        }

        removeIndex(body) // Xóa vị trí cũ

        if (direct === 'left') { // Di chuyen sang trai

            const flag = checkXLeft()
            if (flag) {
                setRestart(true)

                for (let i = 0; i < cell.length; i++){
                    // Xóa food
                    cell[i].classList.remove('food')
                }
            }
            updateXLeft()
        }

        if (direct === 'right') { // Di chuyen sang phai

            const flag = checkXRight()
            if (flag) {
                setRestart(true)

                for (let i = 0; i < cell.length; i++){
                    // Xóa food
                    cell[i].classList.remove('food')
                }
            }
            updateXRight()
        }

        if (direct === 'up') { // Di chuyen di len

            // Kiểm tra xem con rắn có đụng vào tường hay chưa
            const flag = checkYUp()
            if (flag) {
                setRestart(true)

                for (let i = 0; i < cell.length; i++){
                    // Xóa food
                    cell[i].classList.remove('food')
                }
            }
            updateYUp()
        }

        if (direct === 'down') { // Di chuyen di xuong

            // Kiểm tra xem con rắn có đụng vào tường hay chưa
            const flag = checkYDown()
            if (flag) {
                setRestart(true)

                for (let i = 0; i < cell.length; i++){
                    // Xóa food
                    cell[i].classList.remove('food')
                }
            }
            updateYDown()
        }

    }

    // Hàm này so sánh
    function combination(pos) {
        for (let i = 0; i < pos.length; i++) {
            if (pos[i] === body) {
                return true
            }
        }

        return false
    }

    // Hàm này dùng để check bên left
    function checkXLeft() {
        const posXLeft = moveLeft(14, 14)
        const flag = combination(posXLeft)

        if (flag) {
            return true
        }

        return false
    }

    // Hàm này dùng để check bên right
    function checkXRight() {
        const posXRight = moveRight(14, 14)
        const flag = combination(posXRight)

        if (flag) {
            return true
        }

        return false
    }

    // Hàm này dùng để check bên up
    function checkYUp() {
        const posYUp = rowStart(14)
        const flag = combination(posYUp)

        if (flag) {
            return true
        }

        return false
    }

    // Hàm này dùng để check bên down
    function checkYDown() {
        const posYDown = rowLength(14, 14)
        const flag = combination(posYDown)

        if (flag) {
            return true
        }

        return false
    }

    // Hàm này xóa
    function removeIndex(index) {

        const cell = document.querySelectorAll('[data-colum-snake]')[index]

        cell.classList.remove('move')
    }

    // Hàm này update di chuyển left 77, 91, 105 -> 76 77 91 || 105, 91, 77 -> 104 105 91
    function updateXLeft() {
        setBody(body - 1)
    }

    // Hàm này update di chuyển right 77, 91, 105 -> 78 77 91 || 105, 91, 77 -> 106 105 91
    function updateXRight() {
        setBody(body + 1)
    }

    // Hàm này update di chuyển up 77, 78, 79 -> 63 77 78 || 79, 78, 77 -> 78 79 65
    function updateYUp() {
        setBody(body - 14)
    }

    // Hàm này update di chuyển down 77 78, 78 77
    function updateYDown() { 
        setBody(body + 14)
    }

    function randomFood() {

        const index = Math.floor(Math.random() * 196);

        const cell = document.querySelectorAll('[data-colum-snake]')[index]

        cell.classList.add('food')

    }

    // Hàm này để gọi lại những function move
    useEffect(() => {

        if (restart){
            return
        }

        if (start) {
            if (move === 65) { // Di chuyển sang trái
                if (direct === 'left'){
                    return
                }
                setDirect('left')
                moveBody()
                setMove(null)
            } else if (move === 87) { // Di chuyển đi lên
                if (direct === 'up'){
                    return
                }
                setDirect('up')
                moveBody()
                setMove(null)
            } else if (move === 68) { // Di chuyển sang phải
                if (direct === 'right'){
                    return
                }
                setDirect('right')
                moveBody()
                setMove(null)
            } else if (move === 83) { // Di chuyển đi xuống
                if (direct === 'down'){
                    return
                }
                setDirect('down')
                moveBody()
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

    const handlerStart = (e) => {
        e.preventDefault()

        setStart(true)
        setLevel(true)
    }

    const handlerRestart = (e) => {
        e.preventDefault()

        // Khởi tạo lại ban đầu
        setRestart(false)
        randomFood()
        setBody(75)
        setScore(0)
    }

    const handlerUp = () => {

        if (restart){
            return
        }

        if (play){
            setMove(87)
        }
    }

    const handlerLeft = () => {
        if (restart){
            return
        }

        if (play){
            setMove(65)
        }
    }

    const handlerDown = () => {
        if (restart){
            return
        }

        if (play){
            setMove(83)
        }
    }

    const handlerRight = () => {
        if (restart){
            return
        }

        if (play){
            setMove(68)
        }
    }

    const handlerEasy = (e) => {
        e.preventDefault()

        setLevel(500)
        setPlay(true)
    }
    const handlerNormal = (e) => {
        e.preventDefault()

        setLevel(300)
        setPlay(true)
    }
    const handlerHard = (e) => {
        e.preventDefault()

        setLevel(100)
        setPlay(true)
    }

    return (
        <div className="layout-section-teris container">
            <motion.div className="wrapper-snake"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <div className="snake tetris1">
                    {
                        [...Array(196)].map((x, i) => (
                            <div key={i} data-colum-snake className="colum-snake"></div>
                        ))
                    }
                    {
                        restart && (<div className="restart-tetris">
                            <div className="text-center text-white">
                                <h5>Bạn được {score} điểm</h5>
                                <input onClick={handlerRestart} className="btn-restart-tetris" type="submit" value="Chơi lại" />
                            </div>
                        </div>)
                    }
                    {
                        !start && (<div className="restart-tetris">
                            <input onClick={handlerStart} className="btn-restart-tetris" type="submit" value="Bắt đầu" />
                        </div>)
                    }
                    {
                        !play && start && (<div className="restart-tetris">
                            <div className="text-center text-white">
                                <h5>Bạn vui lòng chọn cấp độ</h5>
                                <input onClick={handlerEasy} className="btn-restart-tetris" type="submit" value="Dễ" />&nbsp;
                                <input onClick={handlerNormal} className="btn-restart-tetris" type="submit" value="Thường" />&nbsp;
                                <input onClick={handlerHard} className="btn-restart-tetris" type="submit" value="Khó" />
                            </div>
                        </div>)
                    }
                </div>
                <div className="guide tetris2">
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
                        <div>W: Di chuyển lên</div>
                        <div>A: Di chuyển trái</div>
                        <div>S: Di chuyển phải</div>
                        <div>D: Di chuyển xuống</div>
                    </div>
                    <div className="score-tetris">
                        <div className="score-tetris-title">Điểm</div>
                        <div className="score-tetris-detail">{score}</div>
                    </div>
                </div>
                <div className="control-mobile">
                    <div className="m-2">Điều khiển</div>
                    <div className="group-guide-play">
                        <div className="d-flex justify-content-center">
                            <div className="guide-typing" onClick={handlerUp}>W</div>
                        </div>
                        <div className="d-flex justify-content-center mt-2">
                            <div className="guide-typing typing-A" onClick={handlerLeft}>A</div>
                            <div className="guide-typing typing-S" onClick={handlerDown}>S</div>
                            <div className="guide-typing typing-D" onClick={handlerRight}>D</div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default Snake;