import { AxiosResponse } from "axios";
import jwt from "jsonwebtoken"

export class ParsingError extends Error {
    constructor(msg: string, character: number) {
        super(`${msg}, at character ${character}`)
    }
}

export class DatabaseError extends Error {
    code: number
    constructor(msg: string, code: number) {
        super(msg)
        this.code = code
    }
}

export class AreaError extends Error {
    code: number;
    constructor(msg: string, code: number) {
        super(msg)
        this.code = code
    }
}

export class ProcessError extends Error {
    serviceName: string
    name: string
    err: any
    constructor(serviceName: string, name: string, err: any) {
        super("")
        this.err = err
        this.serviceName = serviceName
        this.name = name
    }
}