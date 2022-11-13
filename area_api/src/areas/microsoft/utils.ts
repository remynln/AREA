import axios from "axios"

export async function getMailFromToken(token: string) {
    console.log(token)
    var res = await axios.get("https://graph.microsoft.com/v1.0/me", {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    return res.data.mail
}

export async function getUserFromToken(token: string) {
    console.log(token)
    var res = await axios.get("https://graph.microsoft.com/v1.0/me", {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    return res.data.givenName
}