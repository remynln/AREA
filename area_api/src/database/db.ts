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
import getArea from "./area/get";
import getAreaFromUser from "./area/getFromUser";
import setStatus from "./area/setStatus";
import deleyeToken from "./tokens/delete";

const db = {
    register:Register,
    login:Login,
    setToken:SetToken,
    getToken:GetToken,
    getServices,
    loginService,
    area: {
        set: setArea,
        setStatus: setStatus,
        forEach: forEach,
        get: getArea,
        getFromUser: getAreaFromUser
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
        delete: deleyeToken,
        refresh: refreshToken,
        getFromUser: getFromUser
    }
}

export default db