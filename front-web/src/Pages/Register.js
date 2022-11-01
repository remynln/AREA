import React, { useState, useEffect } from "react";
import Logo from "../img/Sergify_Logo_Vertical.png"
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import './Login.css'

export const Register = (props) => {
    const [username, setUser] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setError] = useState("");
    const [registerState, setRegister] = useState(false)
    const navigate = useNavigate();

    let RegisterButton = {
        backgroundColor: "#444444",
        boxShadow: "0px 0px 0px 0px"
    };

    useEffect(() => {
        if (props.user === true && localStorage.getItem("jwt") !== null)
            navigate('/dashboard')
        if (password.length < 8 && password.length > 0)
            setError("Password must be more than 8 caracters")
        else if (password.length > 8 && errorMessage === "Password must be more than 8 caracters")
            setError("")
        if (username.length === 0 || email.length === 0 || password.length < 8)
            setRegister(false)
        else
            setRegister(true)
    });

    const navigateToLogin = () => {
        navigate('/login');
    };

    const Register = () => {
        axios.post("http://localhost:8080/auth/register", {
            email: email,
            username: username,
            password: password
        })
        .then(res => {
            if (res.status === 201)
                localStorage.setItem('jwt', JSON.stringify(res.data.token))
                navigate("/dashboard")
        })
        .catch(error => {
            setError(error.response.data.message);
        })
    }

    return (
        <div className="LoginPage">
            <img src={Logo} className="LoginLogo" alt="Login_Logo"/>
            <div className="InputBackground">
                <input className="Input" placeholder="Username" onChange={(event) => setUser(event.target.value)}></input>
            </div>
            <div className="InputBackground" type="email">
                <input className="Input" placeholder="Email" onChange={(event) => setEmail(event.target.value)}></input>
            </div>
            <div className="InputBackground">
                <input className="Input" placeholder="Password" type="password" onChange={(event) => setPassword(event.target.value)}></input>
            </div>
            {errorMessage?<p className="ErrorMessage">{errorMessage}</p>:null}
            <div className="LoginButton" onClick={registerState ? Register : undefined} style={registerState ? undefined : RegisterButton}>
                <p>REGISTER</p>
            </div>
            <div className="RegisterText">
                <p>Already have an account ?</p>
                <p className="RegisterRedirection" onClick={navigateToLogin}>Login here</p>
            </div>
        </div>
    )
}