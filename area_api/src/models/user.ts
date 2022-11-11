import {Mongoose, Schema, model} from "mongoose";

const userSchema = new Schema({
    mail: {type: String},
    username: {type: String},
    password: {type: String},
    admin: {type: Boolean}
}, { timestamps: true })

const userModel = model('User', userSchema)

export default userModel