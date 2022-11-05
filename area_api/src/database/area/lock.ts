import User from '../../models/user'
import Trigger from '../../models/trigger'
import { DatabaseError } from '~/core/errors';
import { Types } from 'mongoose';


// get the connected service in function of user email
export default async function lockAreas(
    userId: string,
    serviceName: string
) {
    let areas = (await Trigger.find({ user_id: userId }))
        .filter((item) =>
            item.action?.split('/')[0] == serviceName ||
            item.reaction?.split('/')[0] == serviceName
        )
    for (let i of areas) {
        await i.updateOne({ status: "locked" })
    }
}