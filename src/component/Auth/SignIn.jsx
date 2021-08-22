import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './Login.css'
import { motion } from 'framer-motion';
import { useForm } from "react-hook-form";
import UserAPI from '../../api/UserAPI';
import { useDispatch } from 'react-redux';
import { getFullname, getUserId } from '../../features/header/userId';

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

function SignIn(props) {

    const history = useHistory()

    const dispatch = useDispatch()

    const [error, setError] = useState(null)

    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = async (data) => {
        
        const res = await UserAPI.postLogin(data)

        if (res.msg === 'Username invalid'){
            setError('Tên đăng nhập không chính xác!')
        }else if (res.msg === 'Password invalid'){
            setError('Mật khẩu không chính xác')
        }else{

            sessionStorage.setItem('userId', res._id)
            sessionStorage.setItem('fullname', res.fullname)

            dispatch(getUserId(res._id))
            dispatch(getFullname(res.fullname))

            history.push('/')
        }

    }

    return (
        <motion.div className="layout-section-login"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <h4 className="login-title">Đăng nhập</h4>
            {
                error && (
                    <div className="text-center text-danger">
                        {error}
                    </div>
                )
            }
            <form className="mr-login" onSubmit={handleSubmit(onSubmit)}>
                <div className="form-login">
                    <input className="input-login" type="text" placeholder="Nhập tên đăng nhập!"
                        id="username" {...register('username', { required: true })} />
                    {
                        errors.username && errors.username.type === "required" && (
                            <span className="login-error">* Tên đăng nhập không được để trống!</span>
                        )
                    }
                </div>
                <div className="form-login">
                    <input className="input-login" type="password" placeholder="Nhập mật khẩu!"
                        id="password" {...register('password', { required: true })} />
                    {
                        errors.password && errors.password.type === "required" && (
                            <span className="login-error">* Mật khẩu không được để trống!</span>
                        )
                    }
                </div>
                <div className="pt-4">
                    <div className="link-signup">
                        <Link to="/signup">Bạn muốn đăng ký tài khoản!</Link>
                    </div>
                </div>
                <div className="form-login">
                    <input className="btn-login" type="submit" value="Đăng nhập" />
                </div>
            </form>
        </motion.div>
    );
}

export default SignIn;