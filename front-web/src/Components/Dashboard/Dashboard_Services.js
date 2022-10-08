import React from "react";
import "./Dashboard.css"
import Services from "../Services/Services"

function Dashboard_Services() {
    return (
        <div className="DashboardServices">
            <div className="ServicesContentTitle">
                <p className="BasicServicesTitle">Basic Services</p>
                <p className="VideoGamesTitle">Video Games</p>
            </div>
            <Services />
        </div>
    )
}

export default Dashboard_Services