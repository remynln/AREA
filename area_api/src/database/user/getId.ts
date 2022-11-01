import bcrypt from 'bcrypt'
import { DatabaseError } from '~/core/errors'
import User from '~/models/user'
import JwtFormat from '~/routes/auth/jwtFormat'

export default async function getUserId(
    username:string
): Promise<string> {
    var user = await User.findOne({username: username})
    if (!user) {
        user = await User.findOne({mail: username})
        if (!user)
            throw new DatabaseError(`Account with username ${username} does not exists`, 404)
    }
    return user._id.toHexString()
}