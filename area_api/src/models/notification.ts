import mongoose, { Schema, model } from "mongoose";

const notification = new Schema({
    notification_id: {type: Number},
    user_id: {type: Number},
    trigger_id: {type: Number},
})

const NotifModel = model('Notification', notification)

export default NotifModel