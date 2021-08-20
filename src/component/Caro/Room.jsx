import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { getValueCaro, getRoomCaro } from '../../features/caro/roomCaro';
import socket from '../../socket/socket'

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

        if (!room){
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
        <div>
            <div onClick={createRoom} className="btn btn-primary">Tạo phòng</div>
            <div>
                <input type="text" onChange={(e) => setRoom(e.target.value)} className="form-control w-25" />
                <div onClick={findRoom} className="btn btn-success">Tìm phòng</div>
            </div>
        </div>
    );
}

export default Room;