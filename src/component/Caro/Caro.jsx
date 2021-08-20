import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import socket from '../../socket/socket';
import './Caro.css'
import WINNING_COMBINATIONS from './Algorithm';

const X_CLASS = 'x'
const O_CLASS = 'o'

function Caro(props) {

    const [flag, setFlag] = useState(null)

    const status = useSelector((state) => state.room.value)
    
    const room = useSelector((state) => state.room.room)

    const [messWin, setMessWin] = useState(null)

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
            if (checkWin(currentClass, cellElements)){
                setMessWin(`${data.status.toUpperCase()} đã chiến thắng`)
            }

            // Thay đổi trạng thái cho phép đi cờ
            setFlag(true)

        })

    }, [])

    const handlerClick = (e, i) => {

        if (!flag){
            return
        }

        const cell = e.target
        const currentClass = status === 'o' ? O_CLASS : X_CLASS
        placeMark(cell, currentClass)

        const cellElements = document.querySelectorAll('[data-cell]')
        if (checkWin(currentClass, cellElements)){
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

    function flagAllow(){
        if (status === 'x'){
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

    return (
        <div className="layout-section-caro container">
            <div className="wrapper-caro">
                <div className="group-caro-board">
                    <div className="board" id="board">
                    {
                        [...Array(121)].map((x, i) => (
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
                        <div className="text-center">
                            <h5>RoomID: {room}</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Caro;