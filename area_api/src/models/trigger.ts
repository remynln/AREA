import {Mongoose, Schema, model} from "mongoose";

const TriggerSchema = new Schema({
    trigger_id: {type: Number},
    user_id: {type: Number},
    action_id: {type: Number},
    action_params: {type: String},
    title: {type: String},
    description: {type: String},
    condition: {type: String},
    reaction_id: {type: Number},
    reaction_params: {type: String}
})

const TriggerModel = model('Trigger', TriggerSchema)

export default TriggerModel