import User from '../../models/user'
import Trigger from '../../models/trigger'
import { DatabaseError } from '~/core/errors';
import { Area } from '~/core/types';
import { describe } from 'node:test';


// get the connected service in function of user email
export default async function setArea(area: Area) {
    let user = await User.findOne({ mail: area.accountMail });
    if (!user) {
        throw new DatabaseError(`Account with email ${area.accountMail} does not exists`, 404)
    }
    const newTrigger = new Trigger({
        user_id: user._id,
        action:  area.action.ref.serviceName + "/" + area.action.ref.name,
        action_params: area.action.params,
        condition: area.condition,
        reaction:  area.reaction.ref.serviceName + "/" + area.reaction.ref.name,
        reaction_params: area.reaction.params,
        title: area.title,
        description: area.description
    })
    const savedInstance = await newTrigger.save()
    return savedInstance._id;
}