import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import socket from '../../socket/socket';
import './Caro.css'
import WINNING_COMBINATIONS from './Algorithm';
import { motion } from 'framer-motion';
import user1 from '../../global/user1.jpg'
import user2 from '../../global/user2.jpg'
import UserAPI from '../../api/UserAPI';
import avatar from '../../global/avt.jpg'

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

    const [flag, setFlag] = useState(false)

    const status = useSelector((state) => state.room.value)

    const room = useSelector((state) => state.room.room)

    const [messWin, setMessWin] = useState(null)

    // input text message
    const [message, setMessage] = useState('')

    // list messages
    const [messages, setMessages] = useState([])

    const messagesEndRef = useRef(null)

    const [user, setUser] = useState(null)

    const [image, setImage] = useState(null)

    const [another, setAnother] = useState(null)

    const [imageAnother, setImageAnother] = useState(null)

    const [pointX, setpointX] = useState(0)

    const [pointO, setpointO] = useState(0)

    // Đầu tiên khởi chạy hàm này
    useEffect(() => {

        // Hàm này kiểm tra X or O để hiển thị hover cho người chơi
        setBoardHoverClass()

        // Hàm này dùng để get user
        getDetail()

    }, [])

    useEffect(() => {

        // Hàm này dùng để nhận socket đánh cờ từ người chơi khác
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

                checkPoint(data.status)
            }

            // Thay đổi trạng thái cho phép đi cờ
            setFlag(true)

        })

        // Nhận socket tham gia phòng từ người khác
        socket.on('joinRoom', (data) => {

            setAnother(data)
            setImageAnother(data.image)
            setFlag(true)

            const returnData = {
                _id: sessionStorage.getItem('userId'),
                room
            }

            // Gửi ngược socket trả lại cho đối phương
            socket.emit('returnRoom', returnData)

        })

        // Nhận socket trả lại từ đối phương
        socket.on('returnRoom', (data) => {

            setAnother(data)
            setImageAnother(data.image)

        })

    }, [])

    // Hàm này sẽ gửi socket khi đối thủ đánh cờ
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

            checkPoint(status)
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

    // Hàm này dùng để kiểm tra điểm chiến thắng
    function checkPoint(status){
        if (status === 'x'){
            setpointX(pointX + 1)
        }else{
            setpointO(pointO + 1)
        }
    }

    // Hàm này dùng để chơi lại
    const handleRestart = () => {

        setMessWin(null)

        const cellElements = document.querySelectorAll('[data-cell]')

        cellElements.forEach(cell => {
            cell.classList.remove(X_CLASS)
            cell.classList.remove(O_CLASS)
        })

    }

    // Hàm này hiển thị hover
    function setBoardHoverClass() {
        const board = document.getElementById('board')

        if (status === 'o') {
            board.classList.add(O_CLASS)
        } else {
            board.classList.add(X_CLASS)
        }
    }

    // Hàm này đánh dấu vị trí cờ
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

    // Hàm này dùng để gửi tin nhắn
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

    // Hàm này hiển thị tin nhắn ở cuối
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    async function getDetail() {

        const res = await UserAPI.getDetail(sessionStorage.getItem('userId'))

        setUser(res)
        setImage(res.image)


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
                                <div className="msg-info-win">{messWin}</div>
                                <button onClick={handleRestart}>Restart</button>
                            </div>
                        )
                    }

                </div>
                <div className="group-caro-user">
                    <div className="box-caro-user">
                        <div className="header-caro-info">
                            <h5>Số phòng: {room}</h5>
                            <h5>Tỉ số: x thắng {pointX} - o thắng {pointO}</h5>
                        </div>

                        <hr />
                        <div className="user-list">
                            <div className="user-show">
                                <div className="user-caro">
                                    <div className="d-flex">
                                        <div>
                                            {
                                                !image ? (<img className="image-user-caro" src={avatar} alt="" />) :
                                                    (<img className="image-user-caro" src={image} alt="" />)
                                            }
                                        </div>
                                        {
                                            user && <h3 className="name-user-caro">{user.fullname}</h3>
                                        }
                                    </div>
                                    {flag ? (<h5 className="allow-play">Tới lượt chơi của bạn!</h5>) :
                                        <h5 className="allow-play">Bạn chưa tới lượt chơi!</h5>}
                                </div>
                                {
                                    !another && (
                                        <div className="user-caro">
                                            <div className="text-center p-5">
                                                <div className="spinner">
                                                    <div className="bounce1"></div>
                                                    <div className="bounce2"></div>
                                                    <div className="bounce3"></div>
                                                </div>
                                                <h4>Đang chờ đối thủ</h4>
                                            </div>
                                        </div>
                                    )
                                }
                                {
                                    another && (
                                        <div className="user-caro">
                                            <div className="d-flex">
                                                <div>
                                                    {
                                                        !imageAnother ? (<img className="image-user-caro" src={avatar} alt="" />) :
                                                            (<img className="image-user-caro" src={imageAnother} alt="" />)
                                                    }
                                                </div>
                                                {
                                                    another && <h3 className="name-user-caro">{another.fullname}</h3>
                                                }
                                            </div>
                                            { !flag ? (<h5 className="allow-play">Đang chờ đối thủ đánh cờ!</h5>) :
                                                <h5 className="allow-play">Đối thủ đang chờ bạn đấy!</h5>}
                                        </div>
                                    )
                                }

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