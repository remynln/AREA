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
//import { PetsController } from '~/resources/pets/pets.controller'
//import { ExceptionsHandler } from '~/middlewares/exceptions.handler'
//import { UnknownRoutesHandler } from '~/middlewares/unknownRoutes.handler'

const app = express()
const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@area.4a3tikc.mongodb.net/area?retryWrites=true&w=majority`

mongoose.connect(url).then(() => {
    console.log("Connected to database")
})

//middleware to parse json body
app.use(express.json())

//maybe useless
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

AreaInstances.load().then(() => {
    app.listen(config.API_PORT, () => {
        console.log(`Launched on port ${config.API_PORT}`)
    })
})

