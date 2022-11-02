import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Services.css"

function SingleService(props) {
    const [isConnected, setConnection] = useState(props.servicesState[props.name])

    useEffect(() => {
        setConnection(props.servicesState[props.name])
    }, props.servicesState[props.name])

    let Disconnected = {
        border: "3px solid #4B7844"
    };
    
    let Connected = {
        border: "3px solid #BF1B2C"
    };

    return (
        <a className="SingleService" style={isConnected==="connected"?Disconnected:Connected} href={process.env.REACT_APP_SERVER_IP + "/service/" + props.name + "?callback=" + process.env.REACT_APP_FRONT_IP + "/dashboard&jwt=" + JSON.parse(localStorage.getItem("jwt"))}>
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