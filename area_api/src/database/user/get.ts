import User from '../../models/user'
import { DatabaseError } from '~/core/errors';


export default async function getUser(id: string) {
    let user = await User.findById(id)
    if (!user) {
        throw new DatabaseError(`User with id ${id} not found`, 404)
    }
    return user
}