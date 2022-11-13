import { useState } from 'react'
import Dashboard_Workflows from './Dashboard_Workflows';
import Dashboard_Services from './Dashboard_Services';
import { WorkflowPanel } from "../Workflows/WorkflowPanel"
import './Dashboard.css'

export const DashboardContent = (props) => {
    const [inCreation, setInCreation] = useState(false);

    return (
        <div className="PageContent">
            <div>
                <p className="DashboardTitle">Hello {props.user.username} !</p>
                <p className="DashboardSubTitle">Welcome back on Sergify</p>
            </div>
            <WorkflowPanel inCreation={inCreation} setInCreation={setInCreation} services={props.services} setAreas={props.setAreas}/>
            <Dashboard_Workflows inCreation={inCreation} setInCreation={setInCreation} areas={props.areas} setAreas={props.setAreas}/>
            <Dashboard_Services inCreation={inCreation} services={props.services} setServices={props.setServices}/>
        </div>
    )
}