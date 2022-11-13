import cors from 'cors'
import express, { Application } from 'express'
import { config } from './config'
import login from './routes/auth/login'
import checkToken from "~/middlewares/checkToken";
import session from 'express-session'
import area from './routes/area/create'
import google from './core/services/google';
import mongoose from 'mongoose';
import serviceConnect from './routes/service/connect'
import serviceGet from './routes/service/get'
import services from './routes/service/services'
import serviceDisconnect from './routes/service/disconnect'
import users from "./routes/users"
import user from "./routes/user/root"
import areaRoot from "./routes/area/root"
import errorMiddleware from './middlewares/errorHandler';
import checkAdmin from './middlewares/checkAdmin';
import AreaInstances from './core/instances';
import aboutRouter from './routes/about.json';
import { PubSub } from '@google-cloud/pubsub';
import process from 'node:process';
const pubsub = new PubSub({ projectId: "sergify" });
//import { PetsController } from '~/resources/pets/pets.controller'
//import { ExceptionsHandler } from '~/middlewares/exceptions.handler'
//import { UnknownRoutesHandler } from '~/middlewares/unknownRoutes.handler'

const app = express()
const url = process.env.DB_LINK || ""

mongoose.connect(url).then(() => {
    console.log("Connected to database")
})

//middleware to parse json body
app.use(express.json())

app.use(cors());

app.use(session({
    secret: process.env.SESSION_SECRET || '',
    resave: false,
    saveUninitialized: false
}));

app.use('/about.json', aboutRouter)

// login route
app.use('/auth', login)
app.use('/area', checkToken, area)
app.use('/area', checkToken, areaRoot)


// service route
app.use('/service', serviceConnect)
app.use('/services', checkToken, services)
app.use('/service', checkToken, serviceGet)
app.use('/service', checkToken, serviceDisconnect)

app.use('/users', checkToken, checkAdmin, users)
app.use('/user', checkToken, user)

// home route
app.get('/', (req, res) => res.send('hello world'))
/**
 * Gestion des erreurs
 * /!\ Cela doit être le dernier `app.use`
 */

app.use(errorMiddleware)
/**
 * On demande à Express d'ecouter les requêtes sur le port défini dans la config
 */

async function initGmailSub() {
    const topic = pubsub.topic("my-topic")
    var sub = topic.subscription("gmail-sub");
    if ((await sub.exists())[0]) {
        await sub.delete()
    }
    await topic.createSubscription("gmail-sub");
}
initGmailSub().then(() => {
    AreaInstances.load().then(() => {
        app.listen(config.API_PORT, () => {
            console.log(`Ready on port ${config.API_PORT}`)
        })
    })
})

