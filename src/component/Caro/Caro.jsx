import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import socket from '../../socket/socket';
import './Caro.css'
import WINNING_COMBINATIONS from './Algorithm';
import { motion } from 'framer-motion';
import user1 from '../../global/user1.jpg'
import user2 from '../../global/user2.jpg'

const X_CLASS = 'x'
const O_CLASS = 'o'

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

function Caro(props) {

    const [flag, setFlag] = useState(null)

    const status = useSelector((state) => state.room.value)

    const room = useSelector((state) => state.room.room)

    const [messWin, setMessWin] = useState(null)

    // input text message
    const [message, setMessage] = useState('')

    // list messages
    const [messages, setMessages] = useState([
        { id: 1, message: 'Chào bạn!', category: 'send' },
        { id: 2, message: 'Hell guy!', category: 'receive' },
        { id: 3, message: 'Chào bạn!', category: 'send' },
        { id: 4, message: 'Hell guy!', category: 'receive' },
    ])

    const messagesEndRef = useRef(null)

    // Đầu tiên khởi chạy hàm này
    useEffect(() => {

        // Hàm này kiểm tra X or O để hiển thị hover cho người chơi
        setBoardHoverClass()

        // Hàm này kiểm tra xem thử ai được quyền đi trước
        flagAllow()

    }, [])

    useEffect(() => {

        // Hàm này dùng để nhận socket từ người chơi khác
        socket.on('position', (data) => {
            console.log(data)

            // Lấy toàn bộ các ô cờ
            const cellElements = document.querySelectorAll('[data-cell]')

            // Kiểm tra xem người chơi đó là X hay O
            const currentClass = data.status === 'o' ? O_CLASS : X_CLASS

            // Đánh dấu ô cờ mà người chơi khác đã đi
            placeMark(cellElements[data.position], currentClass)

            // Hàm này dùng để kiểm tra
            if (checkWin(currentClass, cellElements)) {
                setMessWin(`${data.status.toUpperCase()} đã chiến thắng`)
            }

            // Thay đổi trạng thái cho phép đi cờ
            setFlag(true)

        })

    }, [])

    const handlerClick = (e, i) => {

        if (!flag) {
            return
        }

        const cell = e.target
        const currentClass = status === 'o' ? O_CLASS : X_CLASS
        placeMark(cell, currentClass)

        const cellElements = document.querySelectorAll('[data-cell]')
        if (checkWin(currentClass, cellElements)) {
            setMessWin(`${status.toUpperCase()} đã chiến thắng`)
        }

        // Gửi socket với data có vị trí ô cờ, room, X or O
        const data = {
            position: i,
            status,
            room
        }

        socket.emit('position', data)
        setFlag(false)

    }

    const handleRestart = () => {

        setMessWin(null)

        const cellElements = document.querySelectorAll('[data-cell]')

        cellElements.forEach(cell => {
            cell.classList.remove(X_CLASS)
            cell.classList.remove(O_CLASS)
        })

    }

    function flagAllow() {
        if (status === 'x') {
            setFlag(true)
            return
        }
        setFlag(false)
    }

    function setBoardHoverClass() {
        const board = document.getElementById('board')

        if (status === 'o') {
            board.classList.add(O_CLASS)
        } else {
            board.classList.add(X_CLASS)
        }
    }

    function placeMark(cell, currentClass) {
        cell.classList.add(currentClass)
    }

    // Hàm kiểm tra có thỏa mãn hay không và nó sẽ trả lại true hoặc false
    function checkWin(currentClass, cellElements) {
        return WINNING_COMBINATIONS.some(combination => {
            return combination.every(index => {
                return cellElements[index].classList.contains(currentClass)
            })
        })
    }

    const handlerMessage = () => {
        console.log(message)

        let newMessages = messages
        
        const data = {
            id: Math.random().toString(),
            message: message,
            category: 'send'
        }

        newMessages.push(data)

        setMessages(newMessages)

        setMessage('')

        scrollToBottom()
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    return (
        <div className="layout-section-caro container">
            <motion.div className="wrapper-caro"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <div className="group-caro-board">
                    <div className="board" id="board">
                        {
                            [...Array(144)].map((x, i) => (
                                <div key={i} className="cell" data-cell onClick={(e) => handlerClick(e, i)}></div>
                            ))
                        }
                    </div>
                    {
                        messWin && (
                            <div className="winning-message show" id="winningMessage">
                                <div>{messWin}</div>
                                <button onClick={handleRestart}>Restart</button>
                            </div>
                        )
                    }

                </div>
                <div className="group-caro-user">
                    <div className="box-caro-user">
                        <div className="d-flex justify-content-between">
                            <h5>Số phòng: {room}</h5>
                            <h5>Tỉ số: x thắng 1 - o thắng 2</h5>
                        </div>

                        <hr />
                        <div className="user-list">
                            <div className="user-show">
                                <div className="user-caro">
                                    <div className="d-flex">
                                        <div>
                                            <img className="image-user-caro" src={user1} alt="" />
                                        </div>
                                        <h3 className="name-user-caro">Nguyễn Kim Tiền</h3>
                                    </div>
                                    <h5 className="allow-play">Tới lượt chơi của bạn!</h5>
                                </div>
                                <div className="user-caro">
                                    <div className="d-flex">
                                        <div>
                                            <img className="image-user-caro" src={user2} alt="" />
                                        </div>
                                        <h3 className="name-user-caro">Bae Suzy</h3>
                                    </div>
                                    <h5 className="allow-play">Tới lượt chơi của bạn!</h5>
                                </div>
                            </div>
                            <div className="user-chat">
                                <div className="box-chat">
                                    {
                                        messages && messages.map((value) => (
                                            <div className="message" key={value.id}>
                                                <div className={value.category === 'send' ? 'text-end' 
                                                    : 'text-start'}>
                                                    <span className={value.category === 'send' ? 'padding-message-send' 
                                                    : 'padding-message-receive'}>{value.message}</span>
                                                </div>
                                            </div>
                                        ))
                                    }
                                    <div ref={messagesEndRef} />
                                </div>
                                <div className="box-send-message">
                                    <input onChange={(e) => setMessage(e.target.value)} className="input-send-message" 
                                    type="text" placeholder="Nhập tin nhắn" value={message} />
                                    <div onClick={handlerMessage} className="btn-send-message"><i className="fa fa-paper-plane"></i></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>

    );
}

export default Caro;