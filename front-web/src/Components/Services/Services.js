import React from "react";
import "./Services.css"
import SingleService from "./SingleService"
import { ServicesContent } from "./ServicesContent"

function Services() {
    return (
        <div className="Services">
            {ServicesContent.map((val, key) => {
                return (  
                   <SingleService link={val.link} logo={val.logo} name={val.name}/>   
                )
            })}
        </div>
    )
}

export default Services