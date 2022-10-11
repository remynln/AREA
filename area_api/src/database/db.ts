import Register from "./register";
import Login from "./login";
import SetToken from "./setToken";
import GetToken from "./getToken";

const db = {
    register:Register,
    login:Login,
    setToken:SetToken,
    getToken:GetToken
}

export default db