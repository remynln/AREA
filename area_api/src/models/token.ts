import {Mongoose, Schema, model} from "mongoose";

const tokenSchema = new Schema({
    token_id: {type: Number},
    user_id: {type: Number},
    service_token: {type: String},
    service_name: {type: String}
})

const tokenModel = model('Token', tokenSchema)

export default tokenModel