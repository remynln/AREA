import User from '../../models/user'
import Trigger from '../../models/trigger'
import { DatabaseError } from '~/core/errors';
import { Types } from 'mongoose';


// get the connected service in function of user email
export default async function setStatus(
    id: string,
    status: "enabled" | "disabled"
) {
    let area = Trigger.findById(id)
    if (!area) {
        throw new DatabaseError(`area with id ${id} not found`, 404)
    }
    await area.updateOne({ status: status })
}