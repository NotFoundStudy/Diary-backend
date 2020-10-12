import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';
import LocalLogin from 'passport-local';
import LocalSrategy from LocalLogin.Strategy;

const app = express();
app.use(bodyParser.json());
app.use(session({
    secret: SECRET_CODE,
    cookie: {maxAge: 60 * 60 *1000},
    resave: true,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

const router = express.Router();
        
// local login
passport.use(new LocalSrategy(
    (username, password, done) => {
        username.fineOne({ username: username }, (err, user)=> {
            if(err) {
                return done(err)
            };
            if(!user) {
                return done(null, false, {result: 'noUser'});
            }
            if (!user.validPassword(password)) {
                return done(null, false, {message: 'noPw'});
            }
            return done(null, user);
        });
    }
));

router.post('/login',
    passport.authenticate('local', { 
        successMessage: true,
        failureMessage: false
})) 
