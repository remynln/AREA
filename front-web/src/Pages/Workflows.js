import Sidebar from '../Components/Sidebar/Sidebar';
import { WorkflowCreate } from '../Components/Workflows/WorkflowCreate';
import { Workflow } from '../Components/Workflows/Workflow';
import { WorkflowPanel } from '../Components/Workflows/WorkflowPanel';
import './Home.css'
import './Workflow.css'
import { useState } from 'react';

export const Workflows = (props) => {
    const [inCreation, setInCreation] = useState(false);

    return (
        <div className="Home">
            <Sidebar />
            <div className="workflow__page">
                <div className="dashboard__workflows__title">
                    <p>All workflows</p>
                </div>
                <div style={inCreation === false ? {display: "none"} : {width: "100%", height: "100%"}}>
                    <WorkflowPanel inCreation={inCreation} setInCreation={setInCreation} services={props.services} setAreas={props.setAreas}/>
                </div>
                <div style={inCreation ? {display: "none"} : {width: "95%", height: "87.5%"}}>
                    <div className="workflows__display">
                        <WorkflowCreate setInCreation={setInCreation}/>
                        {
                            props.areas.map((element, key) => {
                                return (
                                    <div style={{marginBottom: "2vh"}}>
                                        <Workflow key={key} workflow={element} setAreas={props.setAreas}/>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}