import { NextFunction, Request, Response } from "express";


export default function checkAdmin(req: Request, res: Response, next: NextFunction) {
    if (!res.locals.userInfo) {
        res.status(500).json({
            message: "Internal server error"
        })
        console.log("checkAdmin middleware must be used after checkToken middleware")
        return
    }
    if (!res.locals.userInfo.admin) {
        res.status(403).json({
            message: "You are not allowed to do this operation"
        })
        return
    }
    next()
}