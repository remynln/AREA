import bcrypt from 'bcrypt'
import { DatabaseError } from '~/core/errors'
import User from '~/models/user'
import JwtFormat from '~/routes/auth/jwtFormat'

export default async function login(
    password:string,
    username:string
): Promise<JwtFormat | undefined> {
    var user = await User.findOne({username: username})
    if (!user) {
        user = await User.findOne({mail: username})
        throw new DatabaseError(`Account with username ${username} does not exists`, 404)
    }
    if (user.password && user.username && user.mail) {
        return await bcrypt.compare(password, user.password)
            ? {
                username: user.username,
                email: user.mail,
                admin: user.admin || false
            }
            : undefined
    }
    throw new DatabaseError("Missing information on user model", 500)
}