import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css'
import { motion } from 'framer-motion';
import { useForm } from "react-hook-form";
import UserAPI from '../../api/UserAPI';
import { useState } from 'react';

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

const defaultValues = {
    fullname: '',
    username: '',
    password: ''
};

function SignUp(props) {

    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)

    const { register, reset, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = async (data) => {

        const body = {
            ...data,
            image: ''
        }

        const res = await UserAPI.postUser(body)

        if (res.msg === 'Invalid'){
            setError(true)
            return
        }

        setError(false)
        setSuccess(true)

        reset({ defaultValues })

        setTimeout(() => {
            setSuccess(false)
        }, 4000)
    }

    return (
        <motion.div className="layout-section-login"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <h4 className="login-title">Đăng ký</h4>
            {
                success && (
                    <div className="text-center text-success">
                        Bạn đã đăng ký thành công!
                    </div>
                )
            }
            {
                error && (
                    <div className="text-center text-danger">
                        Tên đăng nhập đã tồn tại!
                    </div>
                )
            }

            <form className="mr-login" onSubmit={handleSubmit(onSubmit)}>
                <div className="form-login">
                    <input className="input-login" type="text" placeholder="Nhập tên họ tên!"
                        id="fullname" {...register('fullname', { required: true })} />
                    {
                        errors.fullname && errors.fullname.type === "required" && (
                            <span className="login-error">* Họ tên không được để trống!</span>
                        )
                    }
                    
                </div>
                <div className="form-login">
                    <input className="input-login" type="text" placeholder="Nhập tên đăng nhập!"
                        id="username" {...register('username', { required: true })}  />
                    {
                        errors.username && errors.username.type === "required" && (
                            <span className="login-error">* Tên đăng nhập không được để trống!</span>
                        )
                    }
                </div>
                <div className="form-login">
                    <input className="input-login" type="password" placeholder="Nhập mật khẩu!"
                        id="password" {...register('password', { required: true })}  />
                    {
                        errors.password && errors.password.type === "required" && (
                            <span className="login-error">* Mật khẩu không được để trống!</span>
                        )
                    }
                </div>
                <div className="pt-4">
                    <div className="link-signup">
                        <Link to="/signin">Bạn muốn đăng nhập?</Link>
                    </div>
                </div>
                <div className="form-login">
                    <input className="btn-login" type="submit" value="Đăng ký" />
                </div>
            </form>
        </motion.div>
    );
}

export default SignUp;