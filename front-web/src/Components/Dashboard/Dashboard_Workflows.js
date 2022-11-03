import React from "react";
import { Link } from 'react-router-dom'
import { WorkflowCreate } from "../Workflows/WorkflowCreate";
import "./Dashboard.css"

function Dashboard_Workflows(props) {

    let Hide = {
        display: "none"
    };

    return (
        <div className="DashboardWorkflows" style={props.inCreation ? Hide : undefined}>
            <div classname="WorkflowContentTitle">
                <p className="WorkflowTitle">Workflows</p>
                <Link to={"/workflows"} className="WorkflowRedirection"><p>View all</p></Link>
            </div>
            <WorkflowCreate setInCreation={props.setInCreation}/>
        </div>
    )
}

export default Dashboard_Workflows