import React from "react";
import Logo from "../img/Sergify_Logo_Vertical.png"
import { useNavigate } from 'react-router-dom'
import './Login.css'

export const Register = () => {
    const navigate = useNavigate();

    const navigateToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="LoginPage">
            <img src={Logo} className="LoginLogo"/>
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