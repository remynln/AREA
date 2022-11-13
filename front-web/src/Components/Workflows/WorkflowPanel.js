import ClearIcon from '@mui/icons-material/Clear';
import { useEffect, useState } from 'react';
import { WorkflowContent } from './WorkflowContent';
import './Workflows.css'

export const WorkflowPanel = (props) => {
    const [actionServiceActive, setActionServiceActive] = useState(undefined)
    const [actionTriggerActive, setActionTriggerActive] = useState(undefined)
    const [actionParameters, setActionParameters] = useState([])
    const [conditions, setConditions] = useState("")
    const [reactionServiceActive, setReactionServiceActive] = useState(undefined)
    const [reactionActive, setReactionActive] = useState(undefined)
    const [reactionParameters, setReactionParameters] = useState([])

    useEffect(() => {
        if (props.inCreation === false) {
            setActionServiceActive(undefined)
            setActionTriggerActive(undefined)
            setActionParameters([])
            setConditions("")
            setReactionServiceActive(undefined)
            setReactionActive(undefined)
            setReactionParameters([])
        }
    }, [props.inCreation])

    let Hide = {
        display: "none"
    };

    return (
        <div className="WorkflowPanel" style={props.inCreation ? undefined : Hide}>
            <div className='TopWorkflow'>
                <p className='NewWorkflowTitle'>New Workflow</p>
                <div className='ClosePanel' onClick={() => {props.setInCreation(false)}}>
                    <ClearIcon />
                </div>
            </div>
            <WorkflowContent services={props.services} inCreation={props.inCreation} actionServiceActive={actionServiceActive}
                setActionServiceActive={setActionServiceActive} actionTriggerActive={actionTriggerActive} setActionTriggerActive={setActionTriggerActive}
                actionParameters={actionParameters} setActionParameters={setActionParameters} conditions={conditions} setConditions={setConditions}
                reactionServiceActive={reactionServiceActive} setReactionServiceActive={setReactionServiceActive} reactionActive={reactionActive}
                setReactionActive={setReactionActive} reactionParameters={reactionParameters} setReactionParameters={setReactionParameters}/>
            <div className='CreateWorkflow'>
                <div className="CreateWorkflowButton">
                    <p>CREATE</p>
                </div>
            </div>
        </div>
    )
}