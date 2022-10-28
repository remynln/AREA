import React from "react";
import "./Services.css"

function SingleService(props) {
    let Disconnected = {
        border: "3px solid rgb(0, 163, 0)",
        pointerEvents: "auto"
    };

    let Connected = {
        border: "3px solid #BF1B2C",
        pointerEvents: "none"
    };

    return (
        <a className="SingleService" href={props.link} style={JSON.parse(localStorage.getItem(props.name))==="connected"?Connected:Disconnected}>
            <div class="ServiceBg">
                <img src={require("../../img/" + props.logo + ".png")} class="ServiceLogo" alt="Service_Logo"/>
            </div>
        </a>
    )
}

export default SingleService