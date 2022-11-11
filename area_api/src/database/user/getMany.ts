import User from '../../models/user'
import Trigger from '../../models/trigger'
import { DatabaseError } from '~/core/errors';
import { describe } from 'node:test';


// get the connected service in function of user email
export default async function getUsers(number: number, page: number) {
    let users = await User.find({}, {}, {
        skip: number * page,
        limit: number
    })
    return users
}