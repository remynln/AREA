import { Router } from "express";
import { Types } from "mongoose";
import db from "~/database/db";
import checkAdmin from "~/middlewares/checkAdmin";
import areasRouter from "./areas";
import getUser from "./get"


var userDefinedRouter = Router({ mergeParams: true })

userDefinedRouter.use("/", getUser)
userDefinedRouter.use("/areas", areasRouter)

var router = Router()

router.use("/me", (req, res, next) => {
    db.user.getId(res.locals.userInfo.email)
        .then((id) => {
            res.locals.targetUser = id
            next()
        })
        .catch((err) => {
            next(err)
        })
}, userDefinedRouter)

router.use("/:userId", (req, res, next) => {
   if (!Types.ObjectId.isValid(req.params.userId)) {
       res.status(400).json({message: "Invalid userId"})
       return
   }
   next()
}, checkAdmin, (req, res, next) => {
   db.user.get(req.params.userId).then((user) => {
       if (user.admin && res.locals.userInfo.email != "root") {
           res.status(403).json({
               message: "You don't have rights to access admin users"
           })
           return
       }
       res.locals.targetUser = req.params.userId;
       next()
   }).catch((err) => next(err))
}, userDefinedRouter)

export default router