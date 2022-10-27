import {Mongoose, Schema, model, ObjectId} from "mongoose";

const tokenSchema = new Schema({
    user_id: {type: String},
    service_token: {type: String},
    service_refresh_token: {type: String},
    service_name: {type: String}
})


const tokenModel = model('Token', tokenSchema)

export default tokenModel