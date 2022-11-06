import {Mongoose, Schema, model, Types} from "mongoose";

const TriggerSchema = new Schema({
    user_id: {type: Types.ObjectId},
    title: {type: String},
    description: {type: String},
    action: {type: String},
    action_params: {type: String},
    condition: {type: String},
    reaction: {type: String},
    reaction_params: {type: String},
    status: { type: String }
})

const TriggerModel = model('Trigger', TriggerSchema)

export default TriggerModel