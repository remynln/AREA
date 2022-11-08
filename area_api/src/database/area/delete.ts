import User from '../../models/user'
import Trigger from '../../models/trigger'
import { DatabaseError } from '~/core/errors';
import { Area } from '~/core/area';
import { Types } from 'mongoose';
import { Tokens } from '~/core/types';


export default async function deleteArea(areaId: string) {
    let trigger = await Trigger.findByIdAndDelete(areaId)
    if (!trigger)
        throw new DatabaseError(`token with trigger '${areaId}', not found`, 404)
}