import User from '~/models/user'
import Token from '~/models/token'
import { DatabaseError } from '~/core/errors'
import { Types } from 'mongoose'


export default async function deleyeToken(email: string, serviceName: string) {
    let user = await User.findOne({ mail: email })
    if (!user)
        throw new DatabaseError(`user with mail ${email} not found`, 404);
    const token = await Token.findOneAndDelete({
        user_id: user._id,
        service_name: serviceName
    })
    if (!token) {
        throw new DatabaseError(`refreshToken: Token does not exists`, 500)
    }
}