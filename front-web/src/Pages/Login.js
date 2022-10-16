import React, { useState, useEffect } from "react";
import Logo from "../img/Sergify_Logo_Vertical.png"
import GoogleLogo from "../img/Google_Sign_In_Logo.png"
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import Cookies from 'js-cookie'
import './Login.css'

export const Login = () => {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (Cookies.get('jwt') !== undefined)
            navigate('/dashboard')
    });

    const navigateToRegister = () => {
        navigate('/register');
    };

    const Login = () => {
        axios.post("http://localhost:8080/auth/login", {
            email: user,
            password: password
        })
        .then(res => {
          if (res.status === 200)
            Cookies.set('jwt', res.data.token)
            navigate('/dashboard')
        })
        .catch(error => {
            console.log(error.message);
        })
    }

    return (
        <div className="LoginPage">
            <img src={Logo} className="LoginLogo" alt="Login_Logo"/>
            <a className="GoogleSignIn">
                <img className="GoogleSignInLogo" src={GoogleLogo} alt="Google_Logo"/>
                <p>Sign in with Google</p>
            </a>
            <div className="InputBackground">
                <input className="Input" placeholder="Username or Email" onChange={(event) => setUser(event.target.value)}></input>
            </div>
            <div className="InputBackground">
                <input className="Input" placeholder="Password" type="password" onChange={(event) => setPassword(event.target.value)}></input>
            </div>
            <div className="LoginButton" onClick={Login}>
                <p>LOGIN</p>
            </div>
            <div className="RegisterText">
                <p>Don't have an account ?</p>
                <p className="RegisterRedirection" onClick={navigateToRegister}>Register here</p>
            </div>
        </div>
    )
}