import React, { useState } from "react";
import Cookies from 'js-cookie'
import "./Services.css"

function SingleService(props) {
    const [ServiceConnection, setServiceConnection] = useState("disconnected");

    let ConnectionStyle = {
        border: "3px solid rgb(0, 163, 0)",
        pointerEvents: "auto"
    };

    if (ServiceConnection === "connected") {
        ConnectionStyle = {
            border: "3px solid #BF1B2C",
            pointerEvents: "none"
        };
    }

    return (
        <a className="SingleService" href={props.link} style={ConnectionStyle}>
            <div class="ServiceBg">
                <img src={require("../../img/" + props.logo + ".png")} class="ServiceLogo" alt="Service_Logo"/>
            </div>
        </a>
    )
}

export default SingleService