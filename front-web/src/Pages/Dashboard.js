import Sidebar from '../Components/Sidebar/Sidebar';
import { DashboardContent } from '../Components/Dashboard/DashboardContent';
import './Home.css'

export const Dashboard = () => {
    return (
        <div className="Home">
            <Sidebar />
            <DashboardContent />
        </div>
    )
}