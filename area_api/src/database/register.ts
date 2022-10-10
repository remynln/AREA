import bcrypt from 'bcrypt'
import User from '../models/user'


export default async function register(password:string, email:string, uname:string, callback: (err: Error |  null) => void) {
    const encryptedPassword:string = await bcrypt.hash(password, 10)
    const f_mail = await User.findOne({mail: email})
    const f_user = await User.findOne({username: uname})

    if (f_mail || f_user) {
        callback(new Error("User already exists"))
        return
    }
    const newUser = new User({
        username: uname,
        mail: email,
        password: encryptedPassword
    })
    await newUser.save()
}
