import Register from "./register";
import Login from "./login";
import SetToken from "./setToken";
import GetToken from "./getToken";
import getServices from "./getServices";
import loginService from "./loginService";

const db = {
    register:Register,
    login:Login,
    setToken:SetToken,
    getToken:GetToken,
    getServices,
    loginService
}

export default db