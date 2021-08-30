import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import './Snake.css'
import { useEffect } from 'react';
import { moveLeft, moveRight } from '../Tetris/MoveBlock';

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

    const [body, setBody] = useState([77, 76, 75])  // 77 76 75

    useEffect(() => {
        
        if (start){
            randomFood()
        }

    }, [start])

    useEffect(() => {
        
        if (start){

            if (restart){
                return
            }

            const cell = document.querySelectorAll('[data-colum-snake]')

            body.forEach(value => {
                cell[value].classList.add('move')
            })

            const interval = setInterval(() => {
                moveBody()
            }, 500)
        
            return () => clearInterval(interval)
        }

    }, [body, start])

    function moveBody(){

        const XLeft = moveXLeft()
        const XRight = moveXRight()

        if (XLeft){
            console.log("Di chuyen sang trai")

            const flag = checkXLeft()
            if (flag){
                setRestart(true)

                // Xóa food
                const cell = document.querySelectorAll('[data-colum-snake]')[food]
                cell.classList.remove('food')
            }
            removeIndex(body)
            updateXLeft(body)
        }

        if (XRight){
            console.log("Di chuyen sang phai")

            const flag = checkXRight()
            if (flag){
                setRestart(true)

                // Xóa food
                const cell = document.querySelectorAll('[data-colum-snake]')[food]
                cell.classList.remove('food')
            }
            removeIndex(body)
            updateXRight(body)
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
    function checkXLeft(){
        const posXLeft = moveLeft(14, 14)
        const flag = combination(posXLeft)

        if (flag){
            return true
        }

        return false
    }

    // Hàm này dùng để check bên right
    function checkXRight(){
        const posXRight = moveRight(14, 14)
        const flag = combination(posXRight)

        if (flag){
            return true
        }

        return false
    }

    // Hàm này kiểm tra xem nó có phải di chuyển left không
    function moveXLeft(){
        if (body[1] - body[0] === 1){
            return true
        }
        return false
    }

    // Hàm này kiểm tra xem nó có phải di chuyển right không
    function moveXRight(){
        if (body[0] - body[1] === 1){
            return true
        }
        return false
    }

    // Hàm này xóa
    function removeIndex(body){
        const cell = document.querySelectorAll('[data-colum-snake]')

        body.forEach(value => {
            cell[value].classList.remove('move')
        })
    }

    // Hàm này update di chuyển left
    function updateXLeft(body){
        let newBody = []

        for (let i = 0; i < body.length; i++){
            const index = body[i] - 1
            newBody.push(index)
        }

        setBody(newBody)
    }

    function updateXRight(body){
        let newBody = []

        for (let i = 0; i < body.length; i++){
            const index = body[i] + 1
            newBody.push(index)
        }

        setBody(newBody)
    }

    function randomFood(){

        const index = Math.floor(Math.random() * 196);

        setFood(index)

        const cell = document.querySelectorAll('[data-colum-snake]')[index]

        cell.classList.add('food')

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
        setBody([75, 76, 77])
    }

    const handlerUp = () => {
        
    }

    const handlerLeft = () => {

    }

    const handlerDown = () => {

    }

    const handlerRight = () => {

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
                            <input onClick={handlerRestart} className="btn-restart-tetris" type="submit" value="Chơi lại" />
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