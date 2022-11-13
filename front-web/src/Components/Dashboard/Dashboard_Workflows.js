import React from "react";
import { Link } from 'react-router-dom'
import { Workflow } from "../Workflows/Workflow";
import { WorkflowCreate } from "../Workflows/WorkflowCreate";
import "./Dashboard.css"

function Dashboard_Workflows(props) {

    let Hide = {
        display: "none"
    };

    return (
        <div className="DashboardWorkflows" style={props.inCreation ? Hide : undefined}>
            <div className="DashboardWorkflowContentTitle">
                <p className="DashboardWorkflowTitle">Workflows</p>
                <Link to={"/workflows"} className="WorkflowRedirection"><p>View all</p></Link>
            </div>
            <div className="dashboard__workflows__display">
                <WorkflowCreate setInCreation={props.setInCreation}/>
                {
                    props.areas.map((element, key) => {
                        if (key < 5) {
                            return (
                                <Workflow key={key} workflow={element} setAreas={props.setAreas}/>
                            )
                        }
                    })
                }
            </div>
        </div>
    )
}

export default Dashboard_Workflows