import User from '~/models/user'
import Token from '~/models/token'
import { DatabaseError } from '~/core/errors'
import { Types } from 'mongoose'


export default async function refreshToken(tokenId: Types.ObjectId, newAccessToken: string) {
    const token = await Token.findById(tokenId)
    if (!token) {
        throw new DatabaseError(`refreshToken: Token does not exists`, 500)
    }
    token.updateOne({ service_token: newAccessToken })
}