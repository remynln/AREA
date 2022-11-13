import User from '../../models/user'
import Token from '../../models/token'
import { DatabaseError } from '~/core/errors';

export default async function deleteUser(id: string) {
    let user = await User.findByIdAndDelete(id)
    if (!user) {
        throw new DatabaseError(`User with id ${id} not found`, 404)
    }
    await Token.deleteMany({ user_id: user._id })
    return user
}