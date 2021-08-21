import React from 'react';
import './Header.css'
import logo from '../../global/logo.png'
import { Link } from 'react-router-dom';

function Header(props) {
    return (
        <div className="layout-header">
            <div className="container">
                <div className="d-flex justify-content-between">
                    <Link to="/" style={{ textDecoration: 'none'}}>
                        <div className="logo-header">
                            <img src={logo} alt="" />
                            <h3>MoneyK</h3>
                        </div>
                    </Link>
                    <div>
                        <div className="login-header">
                            Đăng Nhập
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;