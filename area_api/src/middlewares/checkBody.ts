import { NextFunction, Request, Response } from "express";

export default function checkBody(properties: Array<string>) {
    return (req: Request, res: Response, next: NextFunction) => {
        for (let i of properties) {
            if (!(i in req.body)) {
                res.status(400).json({
                    message: `Missing '${i}' in body request`
                })
            }
        }
        next()
    }
}