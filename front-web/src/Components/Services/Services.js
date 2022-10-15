import React from "react";
import "./Services.css"
import SingleService from "./SingleService"
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
                   <SingleService link={val.link} logo={val.logo} />   
                )
            })}
        </div>
    )
}

export default Services