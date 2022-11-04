import User from '../../models/user'
import Trigger from '../../models/trigger'
import { DatabaseError } from '~/core/errors';
import { Area, Tokens } from '~/core/types';
import { describe } from 'node:test';
import Token from '~/models/token';
import db from '../db';
import { Types } from 'mongoose';

interface ITrigger {
    _id: Types.ObjectId
    title: string
    description: string
    action: string
    action_params: string
    condition: string
    reaction: string
    reaction_params: string
}

export default async function forEach(
    trigger: (accountMail: string, tokens: Map<string, Tokens>, area: ITrigger) => Promise<void>
) {
    for await (let user of User.find()) {
        let tokens = await db.token.getFromUser(user._id)
        for await (let triggerd of Trigger.find({ user_id: user._id })) {
            let area: ITrigger = {
                _id: triggerd._id,
                title: triggerd.title || '',
                description: triggerd.description || '',
                action: triggerd.action || '',
                action_params: triggerd.action_params || '',
                condition: triggerd.condition || '',
                reaction: triggerd.reaction || '',
                reaction_params: triggerd.reaction_params || ''
            }
            await trigger(user.mail || '', tokens, area)
        }
    }
}