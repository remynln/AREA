import User from '../../models/user'
import { DatabaseError } from '~/core/errors';


export default async function getFromMail(mail: string) {
    let user = await User.findOne({ mail: mail })
    if (!user) {
        throw new DatabaseError(`User with mail ${mail} not found`, 404)
    }
    return user
}