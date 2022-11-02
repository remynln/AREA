import User from '../../models/user'
import { DatabaseError } from '~/core/errors';

export default async function deleteUser(id: string) {
    let user = await User.findByIdAndDelete(id)
    if (!user) {
        throw new DatabaseError(`User with id ${id} not found`, 404)
    }
    return user
}