import bcrypt from 'bcrypt'
import { DatabaseError } from '~/core/errors'
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
            throw new DatabaseError("missing mail in a user Model", 500)
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
