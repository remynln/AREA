import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { listenerCount } from "process";

export default function checkToken(req: Request, res: Response, next: NextFunction) {
    let token = req.headers.authorization?.split(' ')
    if (!token) {
        res.status(403).json({
            message: "No access token"
        })
        return;
    }
    try {
        if (token.length == 2 && jwt.verify(token[1], process.env.JWT_KEY || '')) {
            next()
            return;
        }
        res.status(403).json({
            message: "Invalid access token"
        })
    } catch {
        res.status(403).json({
            message: "Invalid access token"
        })
    }
}