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
import { checkCondition, checkConditionSyntax, checkSimpleCondition } from './core/formatting';
import errorMiddleware from './middlewares/errorHandler';
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
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

// login route
app.use('/auth', login)
app.use('/area', checkToken, area)


// service route
app.use('/service', checkToken, serviceConnect)
app.use('/services', checkToken, services)
app.use('/service', checkToken, serviceGet)

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
app.listen(config.API_PORT, () => {
    console.log(`Launched on port ${config.API_PORT}`)
})
