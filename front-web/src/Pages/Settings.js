import Sidebar from '../Components/Sidebar/Sidebar';
import PersonIcon from '@mui/icons-material/Person';
import ShieldIcon from '@mui/icons-material/Shield';
import DownloadIcon from '@mui/icons-material/Download';
import { useState } from 'react';
import './Home.css'
import './Settings.css'

export const Settings = (props) => {
    const [activeRow, setActiveRow] = useState("user")

    const checkRowActive = (row) => {
        console.log(row)
        if (activeRow === row) {
            return {backgroundColor: "#BF1B2C", color: "white", fontWeight: "bold"}
        }
        return (undefined)
    }

    return (
        <div className="Home">
            <Sidebar />
            <div className='settingsContent'>
                <div className='userPanel'>
                    <div className='userPanel__sideBar'>
                        <div className='userPanel__sideBar__title'>
                            <p>USER PANEL</p>
                        </div>
                        <div className='userPanel__sideBar__rows'>
                            <div className='userPanel__sideBar__rows__row' style={checkRowActive("user")}
                                onClick={async () => {await setActiveRow("user")}}>
                                <div style={{marginRight: "5%", marginTop: "2%"}}>
                                    <PersonIcon />
                                </div>
                                <p className='userPanel__sideBar__rows__row__title'>User</p>
                            </div>
                            <div className='userPanel__sideBar__rows__row' style={checkRowActive("admin")}
                                onClick={async () => {await setActiveRow("admin")}}>
                                <div style={{marginRight: "5%", marginTop: "2%"}}>
                                    <ShieldIcon />
                                </div>
                                <p>Admin</p>
                            </div>
                            <a href='/app/client/area_mobile.apk' download style={{textDecoration: "none"}}>
                                <div className='userPanel__sideBar__rows__row'>
                                    <div style={{marginRight: "5%", marginTop: "2%"}}>
                                        <DownloadIcon />
                                    </div>
                                    <p>Download Mobile</p>
                                </div>
                            </a>
                        </div>
                    </div>
                    <div>

                    </div>
                </div>
            </div>
        </div>
    )
}