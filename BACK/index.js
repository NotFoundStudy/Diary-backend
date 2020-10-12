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

dotenv.config();
const app = express();
app.use(helmet());
app.use(logger("tiny"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: SECRET_CODE,
    cookie: {maxAge: 60 * 60 *1000},
    resave: true,
    saveUninitialized: false
}));

db().connect;

app.get('/', (req,res) => {
    res.send('Hello Exprsess')
});

app.listen(process.env.PORT, ()=>{
    console.log(`⛳ Express Server Listening at http://localhost:${process.env.PORT}`)
});


