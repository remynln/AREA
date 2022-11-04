import User from '../../models/user'
import Trigger from '../../models/trigger'
import { DatabaseError } from '~/core/errors';
import { Area } from '~/core/types';
import { Types } from 'mongoose';


// get the connected service in function of user email
export default async function setArea(area: Area) {
    let user = await User.findOne({ mail: area.accountMail });
    if (!user) {
        throw new DatabaseError(`Account with email ${area.accountMail} does not exists`, 404)
    }
    let trigger = await Trigger.findOne({ user_id: user._id, title: area.title})
    if (trigger) {
        throw new DatabaseError(`Trigger with title '${area.title}' already exists for ${user.username}`, 403)
    }
    var newTrigger =  new Trigger({
        user_id: user._id,
        action: area.action.ref.serviceName + "/" + area.action.ref.name,
        action_params: JSON.stringify(area.action.params),
        condition: area.condition,
        description: area.description,
        reaction: area.reaction.ref.serviceName + "/" + area.reaction.ref.name,
        reaction_params: JSON.stringify(area.reaction.params),
        title: area.title
    })
    let saved = await newTrigger.save()
    return saved._id
}