import User from '../../models/user'
import { Types } from 'mongoose';
import Trigger from '~/models/trigger';
import { DatabaseError } from '~/core/errors';

export default async function getArea(
    id: string
) {
    let trigger = await Trigger.findById(id)
    if (!trigger)
        throw new DatabaseError(`Trigger '${id} not found`, 404)
    return trigger
}