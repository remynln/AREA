import Register from "./register";
import Login from "./login";
import SetToken from "./setToken";
import GetToken from "./getToken";
import getServices from "./getServices";
import loginService from "./loginService";
import setArea from "./area/set";

const db = {
    register:Register,
    login:Login,
    setToken:SetToken,
    getToken:GetToken,
    getServices,
    loginService,
    area: {
        set: setArea
    }
}

export default db