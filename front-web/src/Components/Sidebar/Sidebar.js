import React from "react";
import './Sidebar.css';
import { Link } from 'react-router-dom'
import { SidebarContent } from './SidebarContent';
import logo from '../../img/Sergify_Logo_Horizontal.png';

function Sidebar() {
    return (
        <div className="Sidebar">
            <div className="SidebarLogo">
                <img src={logo} className="Logo"/>
            </div>
            <ul className="SidebarList">
                {SidebarContent.map((val, key) => {
                    return (
                        <Link key={key} to={val.link}
                        className="row"
                        id={window.location.pathname === val.link ? "active" : ""}>
                            <div class="SidebarIcon">{val.icon}</div>
                            <div class="SidebarTitle">{val.title}</div>
                        </Link>
                    )
                })}
            </ul>
        </div>
    )
}

export default Sidebar