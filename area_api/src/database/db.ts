import Register from "./register";
import Login from "./login";
import SetToken from "./setToken";
import GetToken from "./getToken";
import getServices from "./getServices";

const db = {
    register:Register,
    login:Login,
    setToken:SetToken,
    getToken:GetToken,
    getServices
}

export default db