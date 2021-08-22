import React from 'react';
import './Header.css'
import logo from '../../global/logo.png'
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getFullname, getUserId } from '../../features/header/userId';

function Header(props) {

    const userId = useSelector((state) => state.userId.value)

    const fullname = useSelector((state) => state.userId.fullname)

    const dispatch = useDispatch()

    useEffect(() => {

        if (sessionStorage.getItem('userId')){
            
            dispatch(getUserId(sessionStorage.getItem('userId')))
            dispatch(getFullname(sessionStorage.getItem('fullname')))
            
        }

    }, [])

    return (
        <div className="layout-header">
            <div className="container">
                <div className="d-flex justify-content-between">
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <div className="logo-header">
                            <img src={logo} alt="" />
                            <h3>MoneyK</h3>
                        </div>
                    </Link>
                    {
                        userId ? (
                            <Link to="/profile" className="header-profile">
                                <i className="fa fa-user" style={{ fontSize: '24px', marginRight: '.5rem' }}></i>
                                <h5>{fullname}</h5>
                            </Link>
                        ) : (
                            <Link to='/signin' style={{ textDecoration: 'none' }}>
                                <div className="login-header">
                                    Đăng Nhập
                                </div>
                            </Link>
                        )
                    }

                </div>
            </div>
        </div>
    );
}

export default Header;