import React from "react";
import "./Dashboard.css"
import GoogleBackground from "../../img/Google_bg.jpg"
import GoogleLogo from "../../img/Google_Logo.png"

function Dashboard_Services() {
    return (
        <div className="DashboardServices">
            <div className="ServicesContentTitle">
                <p className="BasicServicesTitle">Basic Services</p>
                <p className="VideoGamesTitle">Video Games</p>
            </div>
            <div className="Services">
                <a href="http://localhost:8080/auth/service/google?callback=http://localhost:3000/dashboard">
                    <div className="Service">
                        <img src={GoogleLogo} id="logo"/>
                    </div>
                </a>    
            </div>
        </div>
    )
}

export default Dashboard_Services