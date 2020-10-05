import express from "express";
import bodyParser from 'body-parser';
import logger from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import session from 'express-session'
import passport from 'passport';

const app = express();
const PORT = 4000;

app.use(helmet());
app.get('/', (req,res) => {
    res.send('Hello Exprsess')
});
app.listen(PORT, ()=>{
    console.log(`⛳ Express Server Listening at http://localhost:${PORT}`)
});