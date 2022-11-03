import User from '../models/user'
import Token from '../models/token'
import { DatabaseError } from '~/core/errors'

export default async function setToken(token: string, refreshToken: string,
    email: string, service:string) {
    const user = await User.findOne({mail: email})
    if (!user) {
        throw new DatabaseError("User not found", 404)
    }
    await Token.deleteMany({ user_id: user._id, service_name: service })
    const newToken = new Token({
        user_id: user._id,
        service_token: token,
        service_refresh_token: refreshToken,
        service_name: service,
    })
    await newToken.save()
}