import ClearIcon from '@mui/icons-material/Clear';
import { useEffect, useState } from 'react';
import { WorkflowContent } from './WorkflowContent';
import axios from 'axios';
import './Workflows.css'

export const WorkflowPanel = (props) => {
    const [actionServiceActive, setActionServiceActive] = useState(undefined)
    const [actionTriggerActive, setActionTriggerActive] = useState(undefined)
    const [actionParameters, setActionParameters] = useState([])
    const [conditions, setConditions] = useState("")
    const [reactionServiceActive, setReactionServiceActive] = useState(undefined)
    const [reactionActive, setReactionActive] = useState(undefined)
    const [reactionParameters, setReactionParameters] = useState([])
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [errorMessage, setErrorMessage] = useState(undefined)

    useEffect(() => {
        if (props.inCreation === false) {
            setActionServiceActive(undefined)
            setActionTriggerActive(undefined)
            setActionParameters([])
            setConditions("")
            setReactionServiceActive(undefined)
            setReactionActive(undefined)
            setReactionParameters([])
            setTitle("")
            setDescription("")
            setErrorMessage(undefined)
        }
    }, [props.inCreation])

    let Hide = {
        display: "none"
    };

    const checkWorkflowParams = () => {
        let checkedParams = 0
    
        if (actionServiceActive === undefined || actionTriggerActive === undefined ||
            reactionServiceActive === undefined || reactionActive === undefined || description === "" || title === "")
            return (false)
        actionParameters.map(element => {
            if (element.value === "")
                checkedParams = 1
        })
        reactionParameters.map(element => {
            if (element.value === "")
                checkedParams = 1
        })
        if (checkedParams === 1)
            return (false)
        return (true)
    }

    const CreateWorkflow = async () => {
        try {
            let workflowContent = {}
            let action = {}
            let reaction = {}
            let condition = ""

            if (conditions !== "")
                condition = conditions + ")"
            if (actionParameters !== []) {
                let actionParams = {}

                actionParameters.map(element => {
                    actionParams[element.name] = element.value
                })
                action = {name: actionServiceActive + "/" + actionTriggerActive, params: actionParams}
            } else
                action = {name: actionServiceActive + "/" + actionTriggerActive}
            if (reactionParameters !== []) {
                let reactParams = {}

                reactionParameters.map(element => {
                    reactParams[element.name] = element.value
                })
                reaction = {name: reactionServiceActive + "/" + reactionActive, params: reactParams}
            } else
                reaction = {name: reactionServiceActive + "/" + reactionActive}
            const res = await axios.post("/area/create", {action, reaction, condition, title, description},
                { headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem("jwt")) } })
        } catch (error) {
            console.log(error)
            setErrorMessage(error.response.data.message)
        }
    }

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
                setReactionActive={setReactionActive} reactionParameters={reactionParameters} setReactionParameters={setReactionParameters}
                setTitle={setTitle} setDescription={setDescription}/>
            <div className='CreateWorkflow'>
                <p className='WorkflowError'>{errorMessage}</p>
                <div className="CreateWorkflowButton" style={checkWorkflowParams() ? undefined : {backgroundColor: "#171717", pointerEvents: "none"}}
                    onClick={() => {CreateWorkflow()}}>
                    <p>CREATE</p>
                </div>
            </div>
        </div>
    )
}