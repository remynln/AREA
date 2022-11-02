import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Services.css"

function SingleService(props) {
    const [isConnected, setConnection] = useState(JSON.parse(localStorage.getItem(props.name)))

    useEffect(() => {
        setConnection(JSON.parse(localStorage.getItem(props.name)))
    }, [localStorage.getItem(props.name)])

    let Disconnected = {
        border: "3px solid #4B7844"
    };
    
    let Connected = {
        border: "3px solid #BF1B2C"
    };

    const ServiceConnection = () => {
        axios.get("/service/" + props.name + "?callback=" + process.env.REACT_APP_FRONT_IP + "/dashboard?jwt=" + JSON.parse(localStorage.getItem("jwt")))
        .then(res => {
            console.log(res)
        })
        .catch(error => {
            console.log(error)
        })
    }

    return (
        <a className="SingleService" style={isConnected==="connected"?Disconnected:Connected} onClick={ServiceConnection}>
            <div className="ServiceBgLogo">
                <div className="ServiceBg">
                    <img src={require("../../img/" + props.logo + ".png")} class="ServiceLogo" alt="Service_Logo"/>
                </div>
            </div>
            <div className="ServiceStateTextBg" style={isConnected==="connected"?{backgroundColor: "#4B7844"}:{backgroundColor: "#BF1B2C"}}>
                <p className="ServiceStateText">{isConnected==="connected"?"CONNECTED":"DISCONNECTED"}</p>
            </div>
        </a>
    )
}

export default SingleService