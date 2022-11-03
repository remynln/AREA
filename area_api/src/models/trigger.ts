import {Mongoose, Schema, model} from "mongoose";

const TriggerSchema = new Schema({
    user_id: {type: Number},
    title: {type: String},
    description: {type: String},
    action: {type: String},
    action_params: {type: String},
    condition: {type: String},
    reaction: {type: String},
    reaction_params: {type: String}
})

const TriggerModel = model('Trigger', TriggerSchema)

export default TriggerModel