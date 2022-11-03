import AddIcon from '@mui/icons-material/Add';
import './Workflows.css'

export const WorkflowCreate = (props) => {
    return (
        <div className="WorkflowAdd" onClick={() => props.setInCreation(true)}>
            <div className="WorkflowCreate">
                <AddIcon />
            </div>
        </div>
    )
}