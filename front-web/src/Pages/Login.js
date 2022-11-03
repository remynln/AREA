import React, { useState, useEffect } from "react";
import Logo from "../img/Sergify_Logo_Vertical.png"
import GoogleLogo from "../img/Google_Sign_In_Logo.png"
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import './Login.css'

export const Login = (props) => {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setError] = useState("");
    const [loginState, setLogin] = useState(false)
    const navigate = useNavigate();
    const params = new URLSearchParams(window.location.search);

    let LoginButton = {
        backgroundColor: "#444444",
        boxShadow: "0px 0px 0px 0px"
    };

    useEffect(() => {
        let token = params.get("token")
    
        if (props.user === true && localStorage.getItem("jwt") !== null)
            navigate('/dashboard')
        else
            props.setUser(false)
        if (token !== null)
            localStorage.setItem('jwt', JSON.stringify(token))
        if (user.length === 0 || password.length < 8)
            setLogin(false)
        else
            setLogin(true)
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
                localStorage.setItem('jwt', JSON.stringify(res.data.token))
        })
        .catch(error => {
            console.log(error)
            setError(error.response.data.message);
        })
    }

    return (
        <div className="LoginPage">
            <img src={Logo} className="LoginLogo" alt="Login_Logo"/>
            <a className="GoogleSignIn" href="http://localhost:8080/auth/service/google?callback=http://localhost:3000/login">
                <img className="GoogleSignInLogo" src={GoogleLogo} alt="Google_Logo"/>
                <p>Sign in with Google</p>
            </a>
            <div className="InputBackground">
                <input className="Input" placeholder="Username or Email" onChange={(event) => setUser(event.target.value)}></input>
            </div>
            <div className="InputBackground">
                <input className="Input" placeholder="Password" type="password" onChange={(event) => setPassword(event.target.value)}></input>
            </div>
            {errorMessage?<p className="ErrorMessage">{errorMessage}</p>:null}
            <div className="LoginButton" onClick={loginState ? Login : undefined} style={loginState ? undefined : LoginButton}>
                <p>LOGIN</p>
            </div>
            <div className="RegisterText">
                <p>Don't have an account ?</p>
                <p className="RegisterRedirection" onClick={navigateToRegister}>Register here</p>
            </div>
        </div>
    )
}