import User from '../models/user'
import Token from '../models/token'
import db from './db'


export default async function setToken(email: string, callback: (err: Error |  null) => void, service_name?: string | null) {
    const user = await User.findOne({username: email})
    if (!user) {
        callback(new Error("Precise an email"))
        return
    }
    const token = await (service_name) ? 
    Token.find({user_id: user._id, service_name: service_name}) :
    Token.find({user_id: user._id})

    // console.log(token)

    return token
}