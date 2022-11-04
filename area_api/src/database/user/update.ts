import User from '../../models/user'
import { DatabaseError } from '~/core/errors';

export interface UserPut {
    username?: string,
    admin?: boolean,
}

export default async function updateUser(id: string, values: UserPut) {
    let user = await User.findById(id)
    if (!user) {
        throw new DatabaseError(`User with id ${id} not found`, 404)
    }
    if (values.username && await User.findOne({ username: values.username }))
        throw new DatabaseError(`Can't update name, because ${values.username} is already took`, 403)
    await user.updateOne(values)
    return user
}