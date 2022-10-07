import Dashboard_Workflows from './Dashboard_Workflows';
import Dashboard_Services from './Dashboard_Services';
import './Dashboard.css'

export const DashboardContent = () => {
    return (
        <div className="PageContent">
            <div>
                <p className="DashboardTitle">Hello User !</p>
                <p className="DashboardSubTitle">Welcome back on Sergify</p>
            </div>
            <Dashboard_Workflows />
            <Dashboard_Services />
        </div>
    )
}