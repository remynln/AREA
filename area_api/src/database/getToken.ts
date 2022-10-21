import User from '../models/user'
import Token from '../models/token'
import db from './db'


export default async function setToken(email: string, service_name: string) {
    const user = await User.findOne({mail: email})
    if (!user) {
        throw new Error("Precise an email", { cause: "handled" })
    }
    const token = await Token.findOne({user_id: user._id, service_name: service_name})
    if (!token || !token.service_token) {
        throw new Error(`You are not authentified to service ${service_name}`)
    }
    return [token.service_token, token.service_refresh_token]
}