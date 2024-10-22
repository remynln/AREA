import React from "react";
import Services from "../Services/Services"
import "./Dashboard.css"

function Dashboard_Services(props) {

    let Hide = {
        display: "none"
    };

    return (
        <div className="DashboardServices" style={props.inCreation ? Hide : undefined}>
            <div className="ServicesContentTitle">
                <p className="BasicServicesTitle">Services</p>
            </div>
            <Services services={props.services} setServices={props.setServices}/>
        </div>
    )
}

export default Dashboard_Services