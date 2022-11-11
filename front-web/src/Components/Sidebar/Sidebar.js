import React from "react";
import './Sidebar.css';
import { Link } from 'react-router-dom'
import { SidebarContent } from './SidebarContent';
import { useNavigate } from 'react-router-dom'
import Logo from '../../img/Sergify_Logo_Horizontal.png';
import LogoutIcon from '@mui/icons-material/Logout';

function Sidebar() {
    const navigate = useNavigate();

    const DisconnectUser = () => {
        localStorage.clear()
        navigate("/login")
    }

    return (
        <div className="Sidebar">
            <div className="SidebarLogo">
                <img src={Logo} className="Logo" alt="Sidebar_Logo"/>
            </div>
            <ul className="SidebarList">
                {SidebarContent.map((val, key) => {
                    return (
                        <Link key={key} to={val.link}
                        className="row"
                        id={window.location.pathname === val.link ? "active" : ""}>
                            <div className="SidebarIcon">{val.icon}</div>
                            <div className="SidebarTitle">{val.title}</div>
                        </Link>
                    )
                })}
            </ul>
            <div className="Logout" onClick={DisconnectUser}>
                <div className="SidebarIcon">
                    <LogoutIcon />
                </div>
                <div className="SidebarTitle">
                    <p>Logout</p>
                </div>
            </div>
        </div>
    )
}

export default Sidebar