import {Mongoose, Schema, model} from "mongoose";

const userSchema = new Schema({
    user_id: {type: Number},
    mail: {type: String},
    username: {type: String},
    password: {type: String},
})

const userModel = model('User', userSchema)

export default userModel