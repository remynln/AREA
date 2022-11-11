import Sidebar from '../Components/Sidebar/Sidebar';
import PersonIcon from '@mui/icons-material/Person';
import ShieldIcon from '@mui/icons-material/Shield';
import DownloadIcon from '@mui/icons-material/Download';
import Admin_False from "../img/Admin_False.png"
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
            <div className='settings'>
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
                                <p className='userPanel__sideBar__rows__row__title'>Admin</p>
                            </div>
                            <a href='/app/client/area_mobile.apk' download style={{textDecoration: "none"}}>
                                <div className='userPanel__sideBar__rows__row'>
                                    <div style={{marginRight: "5%", marginTop: "2%"}}>
                                        <DownloadIcon />
                                    </div>
                                    <p className='userPanel__sideBar__rows__row__title'>Download Mobile</p>
                                </div>
                            </a>
                        </div>
                    </div>
                    <div className='settings__content'>
                        <div className='settings__content__user' style={activeRow === "user" ? undefined : {display: "none"}}>
                            <div className='settings__content__user__informations'>
                                <p className='settings__content__user__informations__title'>MY INFORMATIONS</p>
                                <p className='settings__content__user__informations__subtitle'>Username :</p>
                                <div className='settings__content__user__informations__content'>
                                    <p>{props.user.username}</p>
                                </div>
                                <p className='settings__content__user__informations__subtitle'>Email :</p>
                                <div className='settings__content__user__informations__content'>
                                    <p>{props.user.email}</p>
                                </div>
                            </div>
                        </div>
                        <div className='settings__content__admin' style={activeRow === "admin" ? undefined : {display: "none"}}>
                            <div className='settings__content__admin__false' style={props.user.admin === false ? undefined : {display: "none"}}>
                                <img src={Admin_False} alt='Admin False' className='settings__content__admin__false__img'></img>
                                <p className='settings__content__admin__false__title'>YOU ARE NOT AN ADMIN !</p>
                            </div>
                            <div className='settings__content__admin__true' style={props.user.admin === true ? undefined : {display: "none"}}>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}