import User from '~/models/user'
import Token from '~/models/token'
import { DatabaseError } from '~/core/errors'
import { Types } from 'mongoose'
import { Tokens } from '~/core/types'


export default async function getFromUser(id: Types.ObjectId): Promise<Map<string, Tokens>> {
    const tokens = await Token.find({ user_id: id })
    return new Map(
        tokens.map((item) => {
            var tokens = new Tokens(item.service_token || '', item.service_refresh_token || '')
            tokens.dbId = item._id
            return [
                item.service_name || '',
                tokens
            ]
        })
    )
}