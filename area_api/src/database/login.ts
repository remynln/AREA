import bcrypt from 'bcrypt'
import User from '~/models/user'

export default async function login(password:string, username:string, callback: (err: Error |  null) => void) {
    const user = await User.findOne({username: username})
    if (!user) {
        callback(new Error("User don't exist"))
        return
    }
    if (user.password)
        return bcrypt.compare(password, user.password)
    callback(new Error("No password"))
}