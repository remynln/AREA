import axios from "axios"

export async function getMailFromToken(token: string) {
    console.log(token)
    var res = await axios.get("https://gmail.googleapis.com/gmail/v1/users/me/profile", {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    return res.data.emailAddress
}