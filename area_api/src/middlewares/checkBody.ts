import { NextFunction, Request, Response } from "express";

export default function checkBody(properties: Array<string>) {
    return (req: Request, res: Response, next: NextFunction) => {
        for (let i of properties) {
            if (!(i in req.body)) {
                res.status(403).json({
                    message: `missing '${i}' in body request`
                })
            }
        }
        next()
    }
}