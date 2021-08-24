import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import socket from '../../socket/socket';
import './Caro.css'
import WINNING_COMBINATIONS from './Algorithm';
import { motion } from 'framer-motion';
import UserAPI from '../../api/UserAPI';
import avatar from '../../global/avt.jpg'
import { Link, useHistory } from 'react-router-dom'

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

    const history = useHistory()

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

    const [allowPlay, setAllowPlay] = useState(true)

    const [load, setLoad] = useState(null)

    const [clone, setClone] = useState(null)

    const [position, setPosition] = useState([])

    const [clonePosition, setClonePosition] = useState(null)

    // Đầu tiên khởi chạy hàm này
    useEffect(() => {

        if (!room) {
            history.push('/caro')
            return
        }

        // Hàm này kiểm tra X or O để hiển thị hover cho người chơi
        setBoardHoverClass()

        // Hàm này dùng để get user
        getDetail()

    }, [])

    useEffect(() => {

        // Hàm này dùng để nhận socket đánh cờ từ người chơi khác
        socket.on('position', (data) => {

            setClonePosition(data.position)

            // Kiểm tra xem người chơi đó là X hay O
            const currentClass = data.status === 'o' ? O_CLASS : X_CLASS

            // Đánh dấu ô cờ mà người chơi khác đã đi
            placeMark(data.position, currentClass)

            // Hàm này dùng để kiểm tra
            const cellElements = document.querySelectorAll('[data-cell]')
            if (checkWin(currentClass, cellElements)) {
                setMessWin(`${data.status.toUpperCase()} đã chiến thắng`)

                checkPoint(data.status)

                setAllowPlay(false)
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
                room: sessionStorage.getItem('room')
            }

            // Gửi ngược socket trả lại cho đối phương
            socket.emit('returnRoom', returnData)

        })

        // Nhận socket trả lại từ đối phương
        socket.on('returnRoom', (data) => {

            setAnother(data)
            setImageAnother(data.image)

        })

        // Nhận socket replay trận đấu
        socket.on('replay', () => {
            setAllowPlay(true)
        })

        // Nhận socket leave room
        socket.on('leaveRoom', () => {

            // Cho trạng thái trở về ban đầu
            if (status === 'x') {
                resetBoardgame()
                setImageAnother(null)
                setAnother(null)
                setpointX(0)
                setpointO(0)
                setFlag(false)
            }

            if (sessionStorage.getItem('room') && status === 'o') {
                history.push('/caro')
            }

        })

        // Nhận socket tin nhắn
        socket.on('receive', (data) => {
            setClone(data)
        })

        // Nhận socket bấm phím
        socket.on('keyboard', (data) => {

            if (data.message === '') {
                setLoad(false)
                return
            }

            if (data.message !== '' && !load) {
                setLoad(true)
                scrollToBottom()
            }

        })

    }, [])

    // Vì react khi thay đổi state thì mặc định state nó vẫn không thay đổi về bản chất
    // nên ta phải dùng thêm useEffect để cập nhật lại state
    useEffect(() => {
        if (clone) {
            setMessages(prev => [...prev, clone])
        }
    }, [clone])


    useEffect(() => {
        if (clonePosition) {
            setPosition(prev => [...prev, clonePosition])
        }
    }, [clonePosition])


    // Hàm này sẽ gửi socket khi đối thủ đánh cờ
    const handlerClick = (e, i) => {

        // Kiểm tra xem thử ô cờ này đã được đánh vào hay chưa
        const check = position.every(value => {
            return value !== i
        })

        // Nếu được đánh vào rồi thì return
        if (!check) {
            return
        }

        if (!flag) {
            return
        }

        // set state vị trí ô cờ đã được đánh
        setPosition(prev => [...prev, i])

        const currentClass = status === 'o' ? O_CLASS : X_CLASS
        placeMark(i, currentClass)

        const cellElements = document.querySelectorAll('[data-cell]')
        if (checkWin(currentClass, cellElements)) {
            setMessWin(`${status.toUpperCase()} đã chiến thắng`)

            checkPoint(status)

            setAllowPlay(false)

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
    function checkPoint(status) {
        if (status === 'x') {
            setpointX(pointX + 1)
        } else {
            setpointO(pointO + 1)
        }
    }

    // Hàm này dùng để chơi lại
    const handleRestart = () => {

        setMessWin(null)

        resetBoardgame()

        socket.emit('replay', room)

    }

    function resetBoardgame() {
        const cellElements = document.querySelectorAll('[data-cell]')

        cellElements.forEach(cell => {
            cell.classList.remove(X_CLASS)
            cell.classList.remove(O_CLASS)
        })

        setPosition([])
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
    function placeMark(position, currentClass) {
        // Lấy toàn bộ các ô cờ
        const cell = document.querySelectorAll('[data-cell]')[position]

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

    // Hàm này dùng để gửi socket keyboard
    const handlerKeyboard = (e) => {

        const mess = e.target.value

        setMessage(mess)

        const data = {
            message: mess,
            room
        }

        socket.emit('keyboard', data)

    }

    const handlerEnter = (e) => {

        if (e.key === 'Enter') {
            handlerMessage()
        }

    }

    // Hàm này dùng để gửi tin nhắn
    const handlerMessage = () => {

        const data = {
            _id: sessionStorage.getItem('userId'),
            message,
            room
        }

        socket.emit('send', data)

        setMessages(prev => [...prev, data])

        setMessage('')

        scrollToBottom()

        const reset = {
            message: '',
            room
        }

        socket.emit('keyboard', reset)

    }

    // Hàm này hiển thị tin nhắn ở cuối
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", inline: "nearest" })
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
                <div className="caro-close item1">
                    <Link to="/caro" className="fa fa-close"></Link>
                </div>
                <div className="group-caro-board item3">
                    <div className="board" id="board">
                        {
                            allowPlay ? [...Array(144)].map((x, i) => (
                                <div key={i} className="cell" data-cell onClick={(e) => handlerClick(e, i)}></div>
                            )) : (
                                <div className="text-center p-5">
                                    <div className="spinner">
                                        <div className="bounce1"></div>
                                        <div className="bounce2"></div>
                                        <div className="bounce3"></div>
                                    </div>
                                    <h4>Đang chờ đối thủ</h4>
                                </div>
                            )
                        }
                    </div>
                    {
                        messWin && (
                            <div className="winning-message show" id="winningMessage">
                                <div className="msg-info-win">{messWin}</div>
                                <button onClick={handleRestart}>Chơi Lại</button>
                            </div>
                        )
                    }

                </div>
                <div className="group-caro-user item2">
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
                                            {!flag ? (<h5 className="allow-play">Đang chờ đối thủ đánh cờ!</h5>) :
                                                <h5 className="allow-play">Đối thủ đang chờ bạn đấy!</h5>}
                                        </div>
                                    )
                                }

                            </div>
                            <div className="user-chat">
                                <div className="box-chat">
                                    {
                                        messages && messages.map((value, index) => (
                                            <div className={value._id === sessionStorage.getItem('userId') ? 'message-send'
                                                : 'message-receive'} key={index}>
                                                <div className="message">
                                                    <span className={value._id === sessionStorage.getItem('userId') ?
                                                        'padding-message-send' : 'padding-message-receive'}>{value.message}</span>
                                                </div>
                                            </div>
                                        ))
                                    }
                                    <div ref={messagesEndRef} />
                                    {
                                        load && (
                                            <div className="box-keyboard">
                                                <div className="spinner-message">
                                                    <div className="bounce1-message"></div>
                                                    <div className="bounce2-message"></div>
                                                    <div className="bounce3-message"></div>
                                                </div>
                                            </div>
                                        )
                                    }

                                </div>
                                <div className="box-send-message">
                                    <input onChange={handlerKeyboard} onKeyPress={handlerEnter} className="input-send-message"
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