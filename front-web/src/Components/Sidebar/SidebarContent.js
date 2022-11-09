import React from "react";
import DashboardIcon from '@mui/icons-material/Dashboard';
import AppsIcon from '@mui/icons-material/Apps';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';

export const SidebarContent = [
    {
        title: "Dashboard",
        icon: <DashboardIcon />,
        link: "/dashboard"
    },
    {
        title: "Workflows",
        icon: <AppsIcon />,
        link: "/workflows"
    },
    {
        title: "Settings",
        icon: <SettingsIcon />,
        link: "/settings"
    }
]