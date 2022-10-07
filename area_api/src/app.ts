import cors from 'cors'
import express, { Application } from 'express'
import { config } from './config'
import login from './routes/auth/login'
import checkToken from "~/middlewares/checkToken";
import session from 'express-session'
import area from './routes/area/create'
//import { PetsController } from '~/resources/pets/pets.controller'
//import { ExceptionsHandler } from '~/middlewares/exceptions.handler'
//import { UnknownRoutesHandler } from '~/middlewares/unknownRoutes.handler'

const app = express()

//middleware to parse json body
app.use(express.json())

//maybe useless
app.use(cors())

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

// login route
app.use('/auth', login)
app.use('/area', checkToken, area)

// home route
app.get('/', (req, res) => res.send('hello world'))
/**
 * Gestion des erreurs
 * /!\ Cela doit être le dernier `app.use`
 */
//app.use(ExceptionsHandler)

/**
 * On demande à Express d'ecouter les requêtes sur le port défini dans la config
 */
app.listen(config.API_PORT, () => console.log(`Launched on port ${config.API_PORT}`))