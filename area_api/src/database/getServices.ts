import User from '../models/user'
import Token from '../models/token'
import { DatabaseError } from '~/core/errors';


// get the connected service in function of user email
export default async function getServices(email: string) {
    let user = await User.findOne({ mail: email });
    if (!user) {
        throw new DatabaseError(`Account with email ${email} does not exists`, 404)
    }
    let token = await Token.find({ user_id: user._id })
    let res = token.map((i) => i.service_name || '')
    return res.filter((i) => i != '')
}