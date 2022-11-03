import User from '../../models/user'
import Trigger from '../../models/trigger'
import { DatabaseError } from '~/core/errors';
import { Area } from '~/core/types';
import { describe } from 'node:test';
import Token from '~/models/token';

interface Trigger {
    title: string
    description: string
    action: string
    action_params: string
    condition: string
    reaction: string
    reaction_params: string
}

export default async function forEach(area: Area,
    trigger: (accountMail: string, tokens: any, area: Trigger)    
) {
    let hmm  = await User.findOne()
    for await (let user of User.find()) {
        let tokens = await Token.find({ user_id: user._id })
        for (i of )
        trigger(user.mail, )
    }
}