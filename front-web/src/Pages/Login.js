import React, { useState, useEffect } from "react";
import Logo from "../img/Sergify_Logo_Vertical.png"
import GoogleLogo from "../img/Google_Sign_In_Logo.png"
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import './Login.css'

export const Login = (props) => {
    const [username, setUsername] = useState("");
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
        checkParamsToken()
        if (props.user.username !== undefined && localStorage.getItem("jwt") !== null)
            navigate('/dashboard')
        else if (props.user !== false && localStorage.getItem("jwt") === null) {
            props.setUser(false)
            props.setServices([])
            props.setAreas([])
        }
        if (username.length === 0 || password.length < 8)
            setLogin(false)
        else if (loginState !== true)
            setLogin(true)
    });

    const checkParamsToken = async () => {
        let token = await params.get("token")

        if (token !== null) {
            await localStorage.setItem('jwt', JSON.stringify(token))
            await props.setUser({username: null})
        }
    };

    const navigateToRegister = () => {
        navigate('/register');
    };

    const Login = async () => {
        try {
          const res = await axios.post("/auth/login", { email: username, password: password })

          if (res.status === 200)
            await localStorage.setItem('jwt', JSON.stringify(res.data.token))
            props.setUser({username: null})
        } catch (error) {
            setError(error.response.data.message);
        }
      }

    return (
        <div className="LoginPage">
            <img src={Logo} className="LoginLogo" alt="Login_Logo"/>
            <a className="GoogleSignIn" href={process.env.REACT_APP_SERVER_IP + "/auth/service/google?callback=" + process.env.REACT_APP_FRONT_IP + "/login"}>
                <img className="GoogleSignInLogo" src={GoogleLogo} alt="Google_Logo"/>
                <p>Sign in with Google</p>
            </a>
            <div className="InputBackground">
                <input className="Input" placeholder="Username or Email" onChange={(event) => setUsername(event.target.value)}></input>
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