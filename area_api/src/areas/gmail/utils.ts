import axios from "axios"

export async function getMailFromToken(token: string) {
    var res = await axios.get("https://gmail.googleapis.com/gmail/v1/users/me/profile", {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    console.log("mail getted", res.data.emailAddress)
    return res.data.emailAddress
}