import Sidebar from '../Components/Sidebar/Sidebar';
import PersonIcon from '@mui/icons-material/Person';
import ShieldIcon from '@mui/icons-material/Shield';
import DownloadIcon from '@mui/icons-material/Download';
import Admin_False from "../img/Admin_False.png"
import Admin_Team from "../img/Admin_Team.png"
import Admin_Title_1 from "../img/Admin_Title_1.png"
import Admin_Title_2 from "../img/Admin_Title_2.png"
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import axios from 'axios';
import './Home.css'
import './Settings.css'

export const Settings = (props) => {
    const [activeRow, setActiveRow] = useState("user")

    const checkRowActive = (row) => {
        if (activeRow === row) {
            return {backgroundColor: "#BF1B2C", color: "white", fontWeight: "bold"}
        }
        return (undefined)
    }

    const deleteUser = async (user) => {
        try {
            await axios.delete("/user/" + user.id,
                { headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem("jwt")) } })

            await loadUsers()
        } catch (error) {
            console.log(error)
        }
    }

    const loadUsers = async () => {
      try {
            const res = await axios.get("/users",
                { headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem("jwt")) } })

            props.setUsers(res.data)
        } catch (error) {
            console.log(error)
        }
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
                            <a href='/apk/area_mobile.apk' download style={{textDecoration: "none"}}>
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
                                <p className='settings__content__admin__team__title'> <img src={Admin_Title_1} alt='Admin Img'
                                    className="settings__content__admin__team__title__img"/>WELCOME ON SERGIFY ADMIN TEAM
                                        <img className='settings__content__admin__team__title__img' src={Admin_Title_2} alt='Admin Img'/></p>
                                <div className='settings__content__admin__team'>
                                    <img src={Admin_Team} alt='Admin Team' className='settings__content__admin__team__img'></img>
                                </div>
                                <div className='settings__content__admin__content'>
                                    <p className='settings__content__admin__users__title'>Sergify Users</p>
                                    <div className='settings__content__admin__content__users'>
                                        {props.users.map((element, key) => {
                                            return (
                                                <div className='settings__content__admin__content__user' key={key}>
                                                    <PersonIcon />
                                                    <p className='settings__content__admin__content__user__name'>{element.username}</p>
                                                    <AlternateEmailIcon />
                                                    <p className='settings__content__admin__content__user__email'>{element.email}</p>
                                                    <div className='settings__content__admin__content__user__delete'
                                                        onClick={() => {deleteUser(element)}}>
                                                        <DeleteIcon />
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}