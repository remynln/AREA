import User from '../models/user'
import Token from '../models/token'

export default async function setToken(token: string, email: string, service:string) {
    const user = await User.findOne({mail: email})
    if (!user) {
        throw Error("User not found", { cause: "handled" })
    }
    const newToken = new Token({
        user_id: user._id,
        service_token: token,
        service_name: service,
    })
    await newToken.save()
}
