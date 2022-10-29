import User from '../models/user'
import Token from '../models/token'


// get the connected service in function of user email
export default async function getServices(email: string) {
    let user = await User.findOne({ mail: email });
    console.log("ok", email)
    if (!user) {
        throw new Error("Precise an email", { cause: "handled" })
    }
    let token = await Token.find({ user_id: user._id })
    let res = token.map((i) => i.service_name || '')
    return res.filter((i) => i != '')
}