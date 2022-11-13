import './Workflows.css'
import google from "../../img/Google_Sign_In_Logo.png"
import twitter from "../../img/Twitter_Small_Logo.png"
import genius from "../../img/Genius_Small_Logo.png"
import skyrock from "../../img/Skyrock_Small_Logo.png"
import notion from "../../img/Notion_Small_Logo.png"
import discord from "../../img/Discord_Small_Logo.png"
import github from "../../img/Github_Small_Logo.png"
import microsoft from "../../img/Microsoft_Small_Logo.png"
import twitch from "../../img/Twitch_Small_Logo.png"
import trello from "../../img/Trello_Small_Logo.png"
import gitlab from "../../img/Gitlab_Small_Logo.png"
import mixcloud from "../../img/Mixcloud_Small_Logo.png"
import deezer from "../../img/Deezer_Small_Logo.png"
import spotify from "../../img/Spotify_Small_Logo.png"
import DeleteIcon from '@mui/icons-material/Delete'
import axios from 'axios'

const logos = {
    google,
    twitter,
    genius,
    skyrock,
    notion,
    discord,
    github,
    microsoft,
    twitch,
    trello,
    gitlab,
    mixcloud,
    spotify,
    deezer
}

export const Workflow = (props, key) => {

    const getServiceLogo = (service) => {
        let serviceName = service.split("/")

        return (logos[serviceName[0]])
    }

    const deleteWorkflow = async () => {
        try {
            await axios.delete("/area/" + props.workflow.id,
                { headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem("jwt")) } })

                props.setAreas((current) =>
                    current.filter((area) => area.title !== props.workflow.title)
                );
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="workflow" key={key}>
            <p className='workflow__title'>{props.workflow.title}</p>
            <p className='workflow__description__title'>Description :</p>
            <div className='workflow__description'>
                <p style={{marginLeft: "5%"}}>{props.workflow.description}</p>
            </div>
            <div className='workflow__services'>
                <div className='workflow__services__content'>
                    <p style={{marginTop: '0.5vh'}}>Action</p>
                    <img className='workflow__services__content__logo' src={getServiceLogo(props.workflow.action)}></img>
                </div>
                <div style={{marginLeft: '0.5vh'}} className='workflow__services__content'>
                    <p style={{marginTop: '0.5vh'}}>Reaction</p>
                    <img className='workflow__services__content__logo' src={getServiceLogo(props.workflow.reaction)}></img>
                </div>
            </div>
            <div className='workflow__interactions'>
                <div className='workflow__interactions_delete' onClick={() => {deleteWorkflow()}}>
                    <DeleteIcon />
                </div>
            </div>
        </div>
    )
}