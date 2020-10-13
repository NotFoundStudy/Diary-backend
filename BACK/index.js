import express, { Router } from "express";
import bodyParser from 'body-parser';
import logger from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv'; 
import db from './db';
import routes from './routes';
import passportConfig from './services/config/passport'
dotenv.config();

const app = express();
app.use(helmet());
app.use(logger("tiny"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));
app.use(passport.initialize());
passportConfig();
db().connect;

app.get('/', (req,res) => {
    res.send('Hello Exprsess')
});
app.use('./static', express.static(__dirname + '/public'));

// domain/api/...
/* /... */
app.use('/api', routes);

app.listen(process.env.PORT, ()=>{
    console.log(`⛳ Express Server Listening at http://localhost:${process.env.PORT}`)
});


