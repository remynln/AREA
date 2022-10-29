import bcrypt from 'bcrypt'
import User from '../models/user'


export default async function loginService(
    service: string,
    data: string,
    uname: string,
) {
    const user = await User.findOne({
        mail: `${service}: ${data}`
    })
    if (user) {
        if (!user.mail)
            throw Error("missing mail in a user Model")
        return user.mail
    }
    const newUser = new User({
        username: uname,
        mail: `${service}: ${data}`,
        password: ""
    })
    await newUser.save()
    return `${service}: ${data}`
}
