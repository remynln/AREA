import React from "react";
import "./Services.css"
import { ServicesContent } from "./ServicesContent"

function Services() {
    return (
        <div className="Services">
            {ServicesContent.map((val, key) => {
                return (
                    <a className="SingleService" href={val.link}>
                        <div class="ServiceBg">
                            <img src={require("../../img/" + val.logo + ".png")} class="ServiceLogo"/>
                        </div>
                    </a>    
                )
            })}   
        </div>
    )
}

export default Services