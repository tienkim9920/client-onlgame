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

    const [body, setBody] = useState([76, 77])  // 75 76

    const [move, setMove] = useState(null)

    useEffect(() => {

        if (start) {
            randomFood()

            onTyping()
        }

    }, [start])

    useEffect(() => {

        if (start) {

            if (restart) {
                return
            }

            const cell = document.querySelectorAll('[data-colum-snake]')

            body.forEach(value => {
                cell[value].classList.add('move')
            })

            const interval = setInterval(() => {
                moveBody()
            }, 250)

            return () => clearInterval(interval)
        }

    }, [body, start])

    // Hàm này dùng để di chuyển
    function moveBody() {

        const cell = document.querySelectorAll('[data-colum-snake]')

        if (cell[body[0]].classList.contains('food') || cell[body[1]].classList.contains('food')){

            cell[body[0]].classList.remove('food')
            cell[body[1]].classList.remove('food')

            randomFood()

            setScore(score + 10)
        }

        const XLeft = moveXLeft()
        const XRight = moveXRight()
        const YUp = moveYUp(14)
        const YDown = moveYDown(14)

        if (XLeft) { // Di chuyen sang trai

            const flag = checkXLeft()
            if (flag) {
                setRestart(true)

                // Xóa food
                cell[food].classList.remove('food')
            }
            removeIndex(body)
            updateXLeft(body)
        }

        if (XRight) { // Di chuyen sang phai

            const flag = checkXRight()
            if (flag) {
                setRestart(true)

                // Xóa food
                cell[food].classList.remove('food')
            }
            removeIndex(body)
            updateXRight(body)
        }

        if (YUp) { // Di chuyen di len

            // Kiểm tra xem con rắn có đụng vào tường hay chưa
            const flag = checkYUp()
            if (flag) {
                setRestart(true)

                // Xóa food
                cell[food].classList.remove('food')
            }

            removeIndex(body)
            updateYUp(body, 14)
        }

        if (YDown) { // Di chuyen di xuong

            // Kiểm tra xem con rắn có đụng vào tường hay chưa
            const flag = checkYDown()
            if (flag) {
                setRestart(true)

                // Xóa food
                cell[food].classList.remove('food')
            }

            removeIndex(body)
            updateYDown(body, 14)
        }

    }

    // Hàm này so sánh
    function combination(pos) {
        for (let i = 0; i < pos.length; i++) {
            if (pos[i] === body[0]) {
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

    // Hàm này kiểm tra xem nó có phải di chuyển left không
    function moveXLeft() {
        if (body[1] - body[0] === 1) {
            return true
        }
        return false
    }

    // Hàm này kiểm tra xem nó có phải di chuyển right không
    function moveXRight() {
        if (body[0] - body[1] === 1) {
            return true
        }
        return false
    }

    // Hàm này kiểm tra xem nó có phải di chuyển up không
    function moveYUp(colum) {
        if (body[1] - body[0] === colum) {
            return true
        }
        return false
    }

    // Hàm này kiểm tra xem nó có phải di chuyển down không
    function moveYDown(colum) {
        if (body[0] - body[1] === colum) {
            return true
        }
        return false
    }

    // Hàm này xóa
    function removeIndex(body) {
        const cell = document.querySelectorAll('[data-colum-snake]')

        body.forEach(value => {
            cell[value].classList.remove('move')
        })
    }

    // Hàm này update di chuyển left 77, 91, 105 -> 76 77 91 || 105, 91, 77 -> 104 105 91
    function updateXLeft(body) {
        let newBody = []

        for (let i = 0; i < body.length; i++) {
            if (i > 0 && body[i] - body[i - 1] === 14){  // Đang di chuyển lên mà rẽ trái
                const newIndex = body[i] - 14
                newBody.push(newIndex)
                continue
            }
            if (i > 0 && body[i - 1] - body[i] === 14){ // Đang di chuyển xuống mà rẽ trái
                const newIndex = body[i] + 14
                newBody.push(newIndex)
                continue
            }
            const index = body[i] - 1 
            newBody.push(index)
        }

        setBody(newBody)
    }

    // Hàm này update di chuyển right 77, 91, 105 -> 78 77 91 || 105, 91, 77 -> 106 105 91
    function updateXRight(body) {
        let newBody = []

        for (let i = 0; i < body.length; i++) {
            if (i > 0 && body[i] - body[i - 1] === 14){  // Đang di chuyển lên mà rẽ phải
                const newIndex = body[i] - 14
                newBody.push(newIndex)
                continue
            }
            if (i > 0 && body[i - 1] - body[i] === 14){ // Đang di chuyển xuống mà rẽ phải
                const newIndex = body[i] + 14
                newBody.push(newIndex)
                continue
            }
            const index = body[i] + 1 
            newBody.push(index)
        }

        setBody(newBody)
    }

    // Hàm này update di chuyển up 77, 78, 79 -> 63 77 78 || 79, 78, 77 -> 78 79 65
    function updateYUp(body, colum) {
        let newBody = []

        for (let i = 0; i < body.length; i++) {
            if (i > 0 && body[i] - body[i - 1] === 1){  // Đang di chuyển trái mà rẽ lên
                const newIndex = body[i] - 1
                newBody.push(newIndex)
                continue
            }
            if (i > 0 && body[i - 1] - body[i] === 1){ // Đang di chuyển phải mà rẽ lên
                const newIndex = body[i] + 1
                newBody.push(newIndex)
                continue
            }
            const index = body[i] - colum
            newBody.push(index)
        }

        setBody(newBody)
    }

    // Hàm này update di chuyển down 77 78, 78 77
    function updateYDown(body, colum) { 
        let newBody = []

        for (let i = 0; i < body.length; i++) {
            if (i > 0 && body[i] - body[i - 1] === 1){  // Đang di chuyển trái mà rẽ xuống
                const newIndex = body[i] - 1
                newBody.push(newIndex)
                continue
            }
            if (i > 0 && body[i - 1] - body[i] === 1){ // Đang di chuyển phải mà rẽ xuống
                const newIndex = body[i] + 1
                newBody.push(newIndex)
                continue
            }
            const index = body[i] + colum
            newBody.push(index)
        }

        setBody(newBody)
    }

    function randomFood() {

        const index = Math.floor(Math.random() * 196);

        setFood(index)

        const cell = document.querySelectorAll('[data-colum-snake]')[index]

        cell.classList.add('food')

    }

    // Hàm này để gọi lại những function move
    useEffect(() => {

        const XLeft = moveXLeft()
        const XRight = moveXRight()
        const YUp = moveYUp(14)
        const YDown = moveYDown(14)

        if (restart){
            return
        }

        if (start) {
            if (move === 65) { // Di chuyển sang trái
                if (XLeft){
                    return
                }

                if (XRight){
                    return
                }

                moveSnakeLeft()
                setMove(null)
            } else if (move === 87) { // Di chuyển đi lên
                if (YUp){
                    return
                }

                if (YDown){
                    return
                }

                setMove(null)
                moveSnakeUp()
            } else if (move === 68) { // Di chuyển sang phải
                if (XLeft){
                    return
                }

                if (XRight){
                    return
                }
                
                moveSnakeRight()
                setMove(null)
            } else if (move === 83) { // Di chuyển đi xuống
                if (YUp){
                    return
                }

                if (YDown){
                    return
                }

                moveSnakeDown()
                setMove(null)
            }
        }

    }, [move])

    // Hàm này dùng để rẽ hướng trái
    function moveSnakeLeft(){
        removeIndex(body)
        updateXLeft(body)
    }

    // Hàm này dùng để rẽ hướng phải
    function moveSnakeRight(){
        removeIndex(body)
        updateXRight(body)
    }

    // Hàm này dùng để rẽ hướng lên
    function moveSnakeUp(){
        removeIndex(body)
        updateYUp(body, 14)
    }

    // Hàm này dùng để rẽ hướng xuống
    function moveSnakeDown(){
        removeIndex(body)
        updateYDown(body, 14)
    }

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
    }

    const handlerRestart = (e) => {
        e.preventDefault()

        // Khởi tạo lại ban đầu
        setRestart(false)
        randomFood()
        setBody([75, 76])
        setScore(0)
    }

    const handlerUp = () => {

        if (restart){
            return
        }

        if (start){
            moveSnakeUp()
        }
    }

    const handlerLeft = () => {
        if (restart){
            return
        }

        if (start){
            moveSnakeLeft()
        }
    }

    const handlerDown = () => {
        if (restart){
            return
        }

        if (start){
            moveSnakeDown()
        }
    }

    const handlerRight = () => {
        if (restart){
            return
        }

        if (start){
            moveSnakeRight()
        }
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