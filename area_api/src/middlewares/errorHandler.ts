import { Request, Response } from "express";
import { AreaError, DatabaseError, ParsingError } from "~/core/errors";

export default function errorMiddleware(error: Error, req: Request, res: Response, next: any) {
    console.log("passed in middleware !")
    if (error instanceof ParsingError) {
        res.status(400).send({
            message: `Parsing error: ${error.message}`
        })
        return
    }
    if (error instanceof DatabaseError) {
        if (error.code == 500) {
            console.log(error.message)
            res.status(500).json({ message: "Internal server error" })
        } else {
            res.status(error.code).json({ message: error.message })
        }
        return
    }
    if (error instanceof ParsingError) {
        res.status(400).json({ message: error.message })
        return
    }
    if (error instanceof AreaError) {
        res.status(error.code).json({message: error.message})
        return
    }
    console.log(error)
    res.status(500).json({ message: "Internal server error" })
}