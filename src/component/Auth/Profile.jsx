import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import UserAPI from '../../api/UserAPI';
import { useDispatch } from 'react-redux';
import { getFullname, getUserId } from '../../features/header/userId';
import avatar from '../../global/avt.jpg'
import { useHistory } from 'react-router-dom';

const containerVariants = {
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

function Profile(props) {

    const history = useHistory()

    const [success, setSuccess] = useState(null)

    const [fullname, setFullname] = useState('')
    const [username, setUserame] = useState('')
    const [password, setPassword] = useState('')
    const [image, setImage] = useState('')

    const dispatch = useDispatch()

    const onSubmit = async (e) => {

        e.preventDefault()

        if (!fullname || !password) {
            return
        }

        const body = {
            _id: sessionStorage.getItem('userId'),
            fullname,
            password
        }

        const res = await UserAPI.patchUser(body)
        console.log(res)

        sessionStorage.setItem('fullname', fullname)

        dispatch(getFullname(fullname))

        setSuccess('Bạn đã cập nhật thành công!')

        setTimeout(() => {
            setSuccess(null)
        }, 3000)
    }

    useEffect(() => {

        const fetchData = async () => {
            const res = await UserAPI.getDetail(sessionStorage.getItem('userId'))

            setFullname(res.fullname)
            setUserame(res.username)
            setPassword(res.password)
            setImage(res.image)

        }

        fetchData()

    }, [])

    const openUpload = () => {
        document.getElementById('fileUpload').click()
    }

    const handlerUpload = async (e) => {

        if (e.target.files && e.target.files[0]) {

            const file = e.target.files[0]
            const fileName = e.target.files[0].name
            const formData = new FormData();

            formData.append("file", file);
            formData.append("fileName", fileName);
            formData.append("_id", sessionStorage.getItem('userId'))

            const res = await UserAPI.patchImage(formData)

            if (res.msg === 'Success'){
                setImage(res.image)
                setSuccess('Bạn đã cập nhật thành công!')
            }

            setTimeout(() => {
                setSuccess(null)
            }, 3000)
        }

    }

    const handlerLogout = () => {

        sessionStorage.removeItem('userId')
        sessionStorage.removeItem('fullname')

        dispatch(getFullname(''))
        dispatch(getUserId(''))

        history.push('/')
    }

    return (
        <motion.div className="layout-section-login"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <h4 className="login-title">Thông tin cá nhân</h4>
            {
                success && (
                    <div className="text-center text-success">
                        {success}
                    </div>
                )
            }
            <form className="mr-login">
                <div className="profile-avatar">
                    {
                        image ? <img src={image} alt="" /> : <img src={avatar} alt="" />
                    }
                    <h3>{fullname}</h3>
                </div>
                <div onClick={openUpload}>
                    <input onChange={handlerUpload} type="file" id="fileUpload" />
                    <div className="btn-login">
                        Thay đổi hình ảnh
                    </div>
                </div>
                <div className="form-login">
                    <input className="input-login" onChange={(e) => setFullname(e.target.value)}
                        value={fullname} type="text" />
                    {
                        !fullname && <span className="login-error">* Họ tên không được để trống!</span>
                    }
                </div>
                <div className="form-login">
                    <input className="input-login" type="text" disabled={true} value={username} />
                </div>
                <div className="form-login">
                    <input className="input-login" onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Nhập mật khẩu!"
                        value={password} />
                    {
                        !password && <span className="login-error">* Mật khẩu không được để trống!</span>
                    }
                </div>
                <div className="form-login">
                    <input onClick={onSubmit} className="btn-login" type="submit" value="Cập nhật" />
                </div>
                <div className="form-login">
                    <input onClick={handlerLogout} className="btn-login" type="submit" value="Đăng xuất" />
                </div>
            </form>
        </motion.div>
    );
}

export default Profile;