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
import updateUser from "./user/update";
import deleteUser from "./user/delete";
import refreshToken from "./tokens/refresh";
import getFromUser from "./tokens/getFromUser";
import getFromMail from "./user/getFromMail";
import forEach from "./area/forEach";

const db = {
    register:Register,
    login:Login,
    setToken:SetToken,
    getToken:GetToken,
    getServices,
    loginService,
    area: {
        set: setArea,
        forEach: forEach
    },
    user: {
        getId: getUserId,
        get: getUser,
        getMany: getUsers,
        update: updateUser,
        delete: deleteUser,
        getFromMail: getFromMail
    },
    token: {
        refresh: refreshToken,
        getFromUser: getFromUser
    }
}

export default db