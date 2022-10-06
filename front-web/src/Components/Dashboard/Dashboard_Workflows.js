import React from "react";
import { Link } from 'react-router-dom'
import { WorkflowCreate } from "../Workflows/WorkflowCreate";
import "./Dashboard.css"

function Dashboard_Workflows() {
    return (
        <div className="DashboardWorkflows">
            <div classname="WorkflowContentTitle">
                <p className="WorkflowTitle">Workflows</p>
                <Link to={"/workflows"} className="WorkflowRedirection"><p>View all</p></Link>
            </div>
            <div>
                <WorkflowCreate />
            </div>
        </div>
    )
}

export default Dashboard_Workflows