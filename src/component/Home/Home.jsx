import React, { useEffect } from 'react';
import './Home.css'
import caro from '../../global/logo-caro.png'
import snake from '../../global/logo-snake.png'
import tetris from '../../global/logo-tetris.png'
import { useHistory } from 'react-router-dom';
import { motion } from 'framer-motion'
import socket from '../../socket/socket';
import { useDispatch } from 'react-redux';
import { getRoomCaro, getValueCaro } from '../../features/caro/roomCaro';

const containerVariants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: { delay: .5, duration: .5 }
    }
}

function Home(props) {

    const history = useHistory()

    const dispatch = useDispatch()

    const playCaro = () => {

        if (sessionStorage.getItem('userId')){
            history.push('/caro')
            return
        }

        history.push('/signin')

    }

    const playTetris = () => {

        if (sessionStorage.getItem('userId')){
            history.push('/tetris')
            return
        }

        history.push('/signin')

    }

    useEffect(() => {

        // Gọi hàm
        leaveRoom()

    }, [])

    // Hàm này dùng để leave room chat
    function leaveRoom() {

        if (sessionStorage.getItem('room')) {

            const leaveRoom = sessionStorage.getItem('room')

            socket.emit('leaveRoom', leaveRoom)

            sessionStorage.removeItem('room')

            // set room id
            dispatch(getRoomCaro(''))

            dispatch(getValueCaro(''))

        }

    }

    return (
        <div className="layout-home">
            <motion.div className="container"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <div className="group-list-game">
                    <div className="card">
                        <img src={caro} className="card-img-top" alt="..." />
                        <div className="card-body">
                            <h5 className="card-title">TIC TAC TOE</h5>
                            <p className="card-text">Bạn muốn thể hiện bản thân với mọi người 
                            thì ngay bây giờ hãy cùng rủ bạn vào trải nghiệm tựa game caro này đi nào.</p>
                            <div onClick={playCaro} className="btn btn-primary">Bắt đầu thôi</div>
                        </div>
                    </div>
                    <div className="card">
                        <img src={snake} className="card-img-top" alt="..." />
                        <div className="card-body">
                            <h5 className="card-title">RẮN SĂN MỒI</h5>
                            <p className="card-text">Bạn muốn săn lùng con mồi chỉ trọn vẹn trong 1 giầy
                            đồng hồ thì ngay bây giờ hãy cùng trải nghiệm tựa game rắn săn mồi này để thể bạn là ai.</p>
                            <a href="#" className="btn btn-primary">Bắt đầu thôi</a>
                        </div>
                    </div>
                    <div className="card">
                        <img src={tetris} className="card-img-top" alt="..." />
                        <div className="card-body">
                            <h5 className="card-title">XẾP HÌNH</h5>
                            <p className="card-text">Bạn muốn tìm cảm giác mới trong việc xếp hình thì bạn đã 
                            tìm đúng nơi rồi đó, ở đây chúng tôi sẽ cùng bạn xếp những khối hình thật đẹp.</p>
                            <div onClick={playTetris} className="btn btn-primary">Bắt đầu thôi</div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default Home;