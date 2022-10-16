import React, { useEffect } from "react";
import Logo from "../img/Sergify_Logo_Vertical.png"
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import './Login.css'

export const Register = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (Cookies.get('jwt') !== undefined)
            navigate('/dashboard')
    });

    const navigateToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="LoginPage">
            <img src={Logo} className="LoginLogo" alt="Login_Logo"/>
            <div className="InputBackground">
                <input className="Input" placeholder="Username"></input>
            </div>
            <div className="InputBackground" type="email">
                <input className="Input" placeholder="Email"></input>
            </div>
            <div className="InputBackground">
                <input className="Input" placeholder="Password" type="password"></input>
            </div>
            <div className="LoginButton">
                <p>REGISTER</p>
            </div>
            <div className="RegisterText">
                <p>You have an account ?</p>
                <p className="RegisterRedirection" onClick={navigateToLogin}>Login here</p>
            </div>
        </div>
    )
}