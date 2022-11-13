import React, { useEffect, useState } from "react";
import "./Services.css"

function SingleService(props, key) {
    const [isConnected, setConnection] = useState(props.service)

    useEffect(() => {
        if (props.service !== undefined)
            setConnection(props.service.state)
    }, [props.service])

    let Disconnected = {
        border: "3px solid #4B7844"
    };
    
    let Connected = {
        border: "3px solid #BF1B2C"
    };

    return (
        <a key={key} className="SingleService" style={isConnected==="connected"?Disconnected:Connected} href={process.env.REACT_APP_SERVER_IP + "/service/" + props.name + "?callback=" + process.env.REACT_APP_FRONT_IP + "/dashboard&jwt=" + JSON.parse(localStorage.getItem("jwt"))}>
            <div className="ServiceBgLogo">
                <div className="ServiceBg">
                    <img src={require("../../img/" + props.logo + ".png")} className="ServiceLogo" alt="Service_Logo"/>
                </div>
            </div>
            <div className="ServiceStateTextBg" style={isConnected==="connected"?{backgroundColor: "#4B7844"}:{backgroundColor: "#BF1B2C"}}>
                <p className="ServiceStateText">{isConnected==="connected"?"CONNECTED":"DISCONNECTED"}</p>
            </div>
        </a>
    )
}

export default SingleService