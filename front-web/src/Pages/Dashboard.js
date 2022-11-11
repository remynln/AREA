import Sidebar from '../Components/Sidebar/Sidebar';
import { DashboardContent } from '../Components/Dashboard/DashboardContent';
import './Home.css'

export const Dashboard = (props) => {
    return (
        <div className="Home">
            <Sidebar />
            <DashboardContent user={props.user} services={props.services}/>
        </div>
    )
}