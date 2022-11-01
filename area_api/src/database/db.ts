import Register from "./register";
import Login from "./login";
import SetToken from "./setToken";
import GetToken from "./getToken";
import getServices from "./getServices";
import loginService from "./loginService";
import setArea from "./area/set";
import getUsers from "./user/getMany";
import getUserId from "./user/getId";
import getUser from "./user/get";

const db = {
    register:Register,
    login:Login,
    setToken:SetToken,
    getToken:GetToken,
    getServices,
    loginService,
    area: {
        set: setArea
    },
    user: {
        getId: getUserId,
        get: getUser,
        getMany: getUsers
    }
}

export default db