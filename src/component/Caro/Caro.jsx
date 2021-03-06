import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import socket from '../../socket/socket';
import './Caro.css'
import WINNING_COMBINATIONS from './Algorithm';
import { motion } from 'framer-motion';
import UserAPI from '../../api/UserAPI';
import avatar from '../../global/avt.jpg'
import { Link, useHistory } from 'react-router-dom'
import { blockLeftToRight, blockRightToLeft, blockX, blockY, checkLeftToRight, checkRightToLeft, checkX, checkY } from './CheckBlock';
import { getFocusCaro } from '../../features/caro/roomCaro';

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

    const dispatch = useDispatch()

    const [flag, setFlag] = useState(false)

    const status = useSelector((state) => state.room.value)

    const room = useSelector((state) => state.room.room)

    const focus = useSelector((state) => state.room.focus)

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

    const [clonePoint, setClonePoint] = useState(null)

    // ?????u ti??n kh???i ch???y h??m n??y
    useEffect(() => {

        if (!room) {
            history.push('/caro')
            return
        }

        // H??m n??y ki???m tra X or O ????? hi???n th??? hover cho ng?????i ch??i
        setBoardHoverClass()

        // H??m n??y d??ng ????? get user
        getDetail()

    }, [])

    useEffect(() => {

        // H??m n??y d??ng ????? nh???n socket ????nh c??? t??? ng?????i ch??i kh??c
        socket.on('position', (data) => {

            setClonePosition(data.position)

            // Ki???m tra xem ng?????i ch??i ???? l?? X hay O
            const currentClass = data.status === 'o' ? O_CLASS : X_CLASS

            // ????nh d???u ?? c??? m?? ng?????i ch??i kh??c ???? ??i
            placeMark(data.position, currentClass)

            // Focus n?????c ngta v???a ??i
            placeFocus(data.position)
            dispatch(getFocusCaro(data.position))
            

            // H??m n??y d??ng ????? ki???m tra
            const cellElements = document.querySelectorAll('[data-cell]')
            if (checkWin(currentClass, cellElements, 12)) {
                setMessWin(`${data.status.toUpperCase()} ???? chi???n th???ng`)

                setClonePoint(currentClass)

                setAllowPlay(false)
            }

            // Thay ?????i tr???ng th??i cho ph??p ??i c???
            setFlag(true)

        })

        // Nh???n socket tham gia ph??ng t??? ng?????i kh??c
        socket.on('joinRoom', (data) => {

            setAnother(data)
            setImageAnother(data.image)
            setFlag(true)

            const returnData = {
                _id: sessionStorage.getItem('userId'),
                room: sessionStorage.getItem('room')
            }

            // G???i ng?????c socket tr??? l???i cho ?????i ph????ng
            socket.emit('returnRoom', returnData)

        })

        // Nh???n socket tr??? l???i t??? ?????i ph????ng
        socket.on('returnRoom', (data) => {

            setAnother(data)
            setImageAnother(data.image)

        })

        // Nh???n socket replay tr???n ?????u
        socket.on('replay', () => {
            setAllowPlay(true)
        })

        // Nh???n socket leave room
        socket.on('leaveRoom', () => {

            // Cho tr???ng th??i tr??? v??? ban ?????u
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

        // Nh???n socket tin nh???n
        socket.on('receive', (data) => {
            setClone(data)
        })

        // Nh???n socket b???m ph??m
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

    // V?? react khi thay ?????i state th?? m???c ?????nh state n?? v???n kh??ng thay ?????i v??? b???n ch???t
    // n??n ta ph???i d??ng th??m useEffect ????? c???p nh???t l???i state
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

    useEffect(() => {
        if (clonePoint !== null){
            if (clonePoint === 'x') {
                setpointX(pointX + 1)
            } else {
                setpointO(pointO + 1)
            }
        }

        setClonePoint(null)
    }, [clonePoint])


    // H??m n??y s??? g???i socket khi ?????i th??? ????nh c???
    const handlerClick = (e, i) => {

        // Ki???m tra xem th??? ?? c??? n??y ???? ???????c ????nh v??o hay ch??a
        const check = position.every(value => {
            return value !== i
        })

        // N???u ???????c ????nh v??o r???i th?? return
        if (!check) {
            return
        }

        if (!flag) {
            return
        }

        // set state v??? tr?? ?? c??? ???? ???????c ????nh
        setPosition(prev => [...prev, i])

        const currentClass = status === 'o' ? O_CLASS : X_CLASS
        placeMark(i, currentClass)

        const cellElements = document.querySelectorAll('[data-cell]')

        // remove focus
        if (focus){
            cellElements[focus].classList.remove('focus')
        }

        if (checkWin(currentClass, cellElements, 12)) {
            setMessWin(`${status.toUpperCase()} ???? chi???n th???ng`)

            setClonePoint(currentClass)

            setAllowPlay(false)

        }

        // G???i socket v???i data c?? v??? tr?? ?? c???, room, X or O
        const data = {
            position: i,
            status,
            room
        }

        socket.emit('position', data)
        setFlag(false)

    }

    // H??m n??y d??ng ????? ch??i l???i
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

    // H??m n??y hi???n th??? hover
    function setBoardHoverClass() {
        const board = document.getElementById('board')

        if (status === 'o') {
            board.classList.add(O_CLASS)
        } else {
            board.classList.add(X_CLASS)
        }
    }

    // H??m n??y ????nh d???u v??? tr?? c???
    function placeMark(position, currentClass) {
        // L???y to??n b??? c??c ?? c???
        const cell = document.querySelectorAll('[data-cell]')[position]

        cell.classList.add(currentClass)

    }

    function placeFocus(position){
        // L???y to??n b??? c??c ?? c???
        const cell = document.querySelectorAll('[data-cell]')[position]

        cell.classList.add('focus')
    }

    // H??m ki???m tra c?? th???a m??n hay kh??ng v?? n?? s??? tr??? l???i true ho???c false
    function checkWin(currentClass, cellElements, maTrix) {
        let checkWinner = false

        WINNING_COMBINATIONS.forEach(y => {

            // Ki???m tra ??i???u ??i???n xem th??? d??ng n??o th???a m???n
            const flag = y.every(x => {
                return cellElements[x].classList.contains(currentClass)
            })

            // N???u d??ng ???? th???a m???n th?? m??nh x??t ti???p
            if (flag){
                // Ki???m tra xem n?? thu???c tr?????ng h???p n??o
                const caseX = checkX(y)
                const caseY = checkY(y, maTrix)
                const caseLeftToRight = checkLeftToRight(y, maTrix)
                const caseRightToLeft = checkRightToLeft(y, maTrix)

                // ???? bi??t n?? thu???c tr?????ng h???p n??o r???i
                // Th?? ti???p theo m??nh s??? check 2 ?????u ???? c?? t???n t???i qu??n c??? kh??ng

                if (caseX){
                    if (blockX(y, cellElements)){
                        checkWinner = true
                    }
                }

                if (caseY){
                    if (blockY(y, maTrix, cellElements)){
                        checkWinner = true
                    }
                }

                if (caseLeftToRight){
                    if (blockLeftToRight(y, maTrix, cellElements)){
                        checkWinner = true
                    }
                }

                if (caseRightToLeft){
                    if (blockRightToLeft(y, maTrix, cellElements)){
                        checkWinner = true
                    }
                }
            }
        })
        
        return checkWinner
    }

    // H??m n??y d??ng ????? g???i socket keyboard
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

    // H??m n??y d??ng ????? g???i tin nh???n
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

    // H??m n??y hi???n th??? tin nh???n ??? cu???i
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
                                    <h4>??ang ch??? ?????i th???</h4>
                                </div>
                            )
                        }
                    </div>
                    {
                        messWin && (
                            <div className="winning-message show" id="winningMessage">
                                <div className="msg-info-win">{messWin}</div>
                                <button onClick={handleRestart}>Ch??i L???i</button>
                            </div>
                        )
                    }

                </div>
                <div className="group-caro-user item2">
                    <div className="box-caro-user">
                        <div className="header-caro-info">
                            <h5>S??? ph??ng: {room}</h5>
                            <h5>T??? s???: x th???ng {pointX} - o th???ng {pointO}</h5>
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
                                    {flag ? (<h5 className="allow-play">T???i l?????t ch??i c???a b???n!</h5>) :
                                        <h5 className="allow-play">B???n ch??a t???i l?????t ch??i!</h5>}
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
                                                <h4>??ang ch??? ?????i th???</h4>
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
                                            {!flag ? (<h5 className="allow-play">??ang ch??? ?????i th??? ????nh c???!</h5>) :
                                                <h5 className="allow-play">?????i th??? ??ang ch??? b???n ?????y!</h5>}
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
                                        type="text" placeholder="Nh???p tin nh???n" value={message} />
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