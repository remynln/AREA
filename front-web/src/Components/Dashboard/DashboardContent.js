import { useState } from 'react'
import Dashboard_Workflows from './Dashboard_Workflows';
import Dashboard_Services from './Dashboard_Services';
import { WorkflowPanel } from "../Workflows/WorkflowPanel"
import './Dashboard.css'

export const DashboardContent = () => {
    const [inCreation, setInCreation] = useState(false);

    return (
        <div className="PageContent">
            <div>
                <p className="DashboardTitle">Hello User !</p>
                <p className="DashboardSubTitle">Welcome back on Sergify</p>
            </div>
            <WorkflowPanel inCreation={inCreation} />
            <Dashboard_Workflows inCreation={inCreation} setInCreation={setInCreation}/>
            <Dashboard_Services inCreation={inCreation}/>
        </div>
    )
}