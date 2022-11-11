import ClearIcon from '@mui/icons-material/Clear';
import { WorkflowContent } from './WorkflowContent';
import './Workflows.css'

export const WorkflowPanel = (props) => {

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
            <WorkflowContent services={props.services} inCreation={props.inCreation}/>
            <div className='CreateWorkflow'>
                <div className="CreateWorkflowButton">
                    <p>CREATE</p>
                </div>
            </div>
        </div>
    )
}