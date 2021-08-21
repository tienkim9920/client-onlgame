import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { getValueCaro, getRoomCaro } from '../../features/caro/roomCaro';
import socket from '../../socket/socket'
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: {
        opacity: 0,
        x: '20rem'
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: { type: 'spring', delay: 0.5 }
    },
    exit: {
        x: "-20vh",
        transition: { ease: 'easeInOut' }
    }
};

function Room(props) {

    const history = useHistory()

    const dispatch = useDispatch()

    const [room, setRoom] = useState('')

    const createRoom = () => {
        console.log("Tao Phong")

        const roomID = Math.random().toString()

        socket.emit('room', roomID)

        // Set trạng tháy người chơi X or O
        dispatch(getValueCaro('x'))

        // set room id
        dispatch(getRoomCaro(roomID))

        history.push('/caro/board')
    }

    const findRoom = () => {

        if (!room) {
            return
        }

        console.log("Tim Phong")

        socket.emit('room', room)

        // Set trạng tháy người chơi X or O
        dispatch(getValueCaro('o'))

        // set room id
        dispatch(getRoomCaro(room))

        history.push('/caro/board')
    }

    return (
        <div className="layout-room-caro">
            <div className="group-join-room">
                <motion.div className="width-join-room"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <div onClick={createRoom} className="btn-create-room">Tạo Phòng</div>
                    <div className="box-find-room">
                        <input placeholder="Tìm Phòng" type="text" onChange={(e) => setRoom(e.target.value)} className="input-find-room" />
                        <div onClick={findRoom} className="btn-find-room"><i className="fa fa-search"></i></div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default Room;