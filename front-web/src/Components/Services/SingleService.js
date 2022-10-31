import React from "react";
import "./Services.css"

function SingleService(props) {
    let Disconnected = {
        border: "3px solid #4B7844",
        pointerEvents: "auto"
    };

    let Connected = {
        border: "3px solid #BF1B2C",
        pointerEvents: "none"
    };

    return (
        <a className="SingleService" href={props.link} style={JSON.parse(localStorage.getItem(props.name))==="connected"?Connected:Disconnected}>
            <div className="ServiceBgLogo">
                <div className="ServiceBg">
                    <img src={require("../../img/" + props.logo + ".png")} class="ServiceLogo" alt="Service_Logo"/>
                </div>
            </div>
            <div className="ServiceStateTextBg" style={JSON.parse(localStorage.getItem(props.name))==="connected"?{backgroundColor: "#BF1B2C"}:{backgroundColor: "#4B7844"}}>
                <p className="ServiceStateText">{JSON.parse(localStorage.getItem(props.name))==="connected"?"DISCONNECT":"CONNECT"}</p>
            </div>
        </a>
    )
}

export default SingleService