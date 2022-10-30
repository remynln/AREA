import User from '../models/user'
import Token from '../models/token'
import { DatabaseError } from '~/core/errors'


export default async function setToken(email: string, service_name: string) {
    const user = await User.findOne({mail: email})
    if (!user) {
        throw new DatabaseError(`Account with email ${email} does not exists`, 404)
    }
    const token = await Token.findOne({user_id: user._id, service_name: service_name})
    if (!token || !token.service_token) {
        throw new DatabaseError(`You are not authentified to service ${service_name}`, 403)
    }
    return [token.service_token, token.service_refresh_token]
}