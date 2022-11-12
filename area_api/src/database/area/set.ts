import User from '../../models/user'
import Trigger from '../../models/trigger'
import { DatabaseError } from '~/core/errors';
import { Area } from '~/core/area';
import { Types } from 'mongoose';


export async function checkAreaValidity(area: Area) {
    let user = await User.findOne({ mail: area.accountMail });
    if (!user) {
        throw new DatabaseError(`Account with email ${area.accountMail} does not exists`, 404)
    }
    let trigger = await Trigger.findOne({ user_id: user._id, title: area.title})
    if (trigger) {
        throw new DatabaseError(`Trigger with title '${area.title}' already exists for ${user.username}`, 403)
    }
}

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
        action: area.actionConf.serviceName + "/" + area.actionConf.name,
        action_params: JSON.stringify(area.action.params),
        condition: area.condition,
        description: area.description,
        reaction: area.reactionConf.serviceName + "/" + area.reactionConf.name,
        reaction_params: JSON.stringify(area.reactionParams),
        title: area.title,
        status: "enabled"
    })
    let saved = await newTrigger.save()
    return saved._id
}