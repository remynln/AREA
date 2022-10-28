import ClearIcon from '@mui/icons-material/Clear';
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
        </div>
    )
}