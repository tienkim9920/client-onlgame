import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { getValueCaro, getRoomCaro } from '../../features/caro/roomCaro';
import socket from '../../socket/socket'
import { motion } from 'framer-motion';
import { useEffect } from 'react';

const moveLeft = {
    hidden: {
        opacity: 0,
        x: '20rem'
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: { type: 'spring', delay: 0.5 }
    }
};

const zoomIn = {
    hidden: {
        opacity: 0,
        transform: 'scale(.4)',
    },
    visible: {
        opacity: 1,
        transform: 'scale(1)',
        transition: { type: 'spring', delay: 0.2 }
    },
};

function Room(props) {

    const history = useHistory()

    const dispatch = useDispatch()

    const [room, setRoom] = useState('')

    const [error, setError] = useState(null)

    useEffect(() => {

        // Gọi hàm
        leaveRoom()

    }, [])

    useEffect(() => {

        socket.on('findRoom', (body) => {

            if (parseInt(body.player) < 2 && body.getRoom){
                const data = {
                    _id: sessionStorage.getItem('userId'),
                    room: body.room
                }

                socket.emit('joinRoom', data)
        
                // Set trạng tháy người chơi X or O
                dispatch(getValueCaro('o'))
        
                // set room id
                dispatch(getRoomCaro(data.room))
        
                sessionStorage.setItem('room', data.room)

                history.push('/caro/board')

                return
            }else {
                setError("Bạn không thể vào phòng này!")

                setTimeout(() => {
                    setError(null)
                }, 4000)
            }

        })

    }, [])

    const createRoom = () => {
        console.log("Tao Phong")

        const roomID = Math.random().toString()

        socket.emit('room', roomID)

        // Set trạng tháy người chơi X or O
        dispatch(getValueCaro('x'))

        // set room id
        dispatch(getRoomCaro(roomID))

        sessionStorage.setItem('room', roomID)

        history.push('/caro/board')
    }

    const findRoom = () => {

        if (!room) {
            return
        }

        console.log("Tim Phong")

        socket.emit('findRoom', room)

    }


    // Hàm này dùng để leave room chat
    function leaveRoom() {

        if (sessionStorage.getItem('room')){

            const leaveRoom = sessionStorage.getItem('room')

            socket.emit('leaveRoom', leaveRoom)

            sessionStorage.removeItem('room')

            // set room id
            dispatch(getRoomCaro(''))

            dispatch(getValueCaro(''))

        }

    }

    return (
        <div className="layout-room-caro">
            <div className="group-join-room">
                <motion.div className="width-join-room"
                    variants={moveLeft}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <div onClick={createRoom} className="btn-create-room">Tạo Phòng</div>
                    <div className="box-find-room">
                        <input placeholder="Tìm Phòng" type="text" onChange={(e) => setRoom(e.target.value)} className="input-find-room" />
                        <div onClick={findRoom} className="btn-find-room"><i className="fa fa-search"></i></div>
                    </div>
                    {
                    error && (
                        <motion.div className="mt-3 alert alert-danger show"
                            variants={moveLeft}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                           <span>{error}</span>
                        </motion.div>
                        )
                    }
                </motion.div>
                <motion.div className="width-join-room-phone"
                    variants={zoomIn}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <div onClick={createRoom} className="btn-create-room">Tạo Phòng</div>
                    <div className="box-find-room">
                        <input placeholder="Tìm Phòng" type="text" onChange={(e) => setRoom(e.target.value)} className="input-find-room" />
                        <div onClick={findRoom} className="btn-find-room"><i className="fa fa-search"></i></div>
                    </div>
                    {
                    error && (
                        <motion.div className="mt-3 alert alert-danger show"
                            variants={zoomIn}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <span>{error}</span>
                        </motion.div>
                        )
                    }
                </motion.div>
                
            </div>
        </div>
    );
}

export default Room;