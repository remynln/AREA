import User from '../../models/user'
import { Types } from 'mongoose';
import Trigger from '~/models/trigger';

export default async function getAreaFromUser(
    userId: string
) {
    let triggers = await Trigger.find({ user_id: userId })
    return triggers
}