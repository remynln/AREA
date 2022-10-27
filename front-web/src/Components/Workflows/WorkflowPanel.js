import './Workflows.css'

export const WorkflowPanel = (props) => {
    let Hide = {
        display: "none"
    };

    return (
        <div className="WorkflowPanel" style={props.inCreation ? undefined : Hide}>
        </div>
    )
}