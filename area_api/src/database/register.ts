import bcrypt from 'bcrypt'
import { DatabaseError } from '~/core/errors'
import User from '../models/user'


export default async function register(password:string, email:string, uname:string) {
    const encryptedPassword:string = await bcrypt.hash(password, 10)
    const f_mail = await User.findOne({mail: email})
    const f_user = await User.findOne({username: uname})

    if (f_mail || f_user) {
        throw new DatabaseError("User already exists", 404)
    }
    const newUser = new User({
        username: uname,
        mail: email,
        password: encryptedPassword
    })
    await newUser.save()
}
