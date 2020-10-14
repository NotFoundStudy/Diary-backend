import passport from 'passport';
import passportJWT from 'passport-jwt';
// let UserModel = require('../db/models/users').User;
import User from '../../db/model/users';
import { Strategy as LocalStrategy } from 'passport-local';
// const LocalStrategy = require('passport-local').Strategy;

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

require('dotenv').config();

// https://github.com/jaredhanson/passport-local
module.exports = () => {
	// Local Strategy
	passport.use(
		new LocalStrategy(
			{
				usernameField: 'email',
				passwordField: 'password',
			},
			function (username, password, done) {
				// 이 부분에선 저장되어 있는 User를 비교하면 된다.
				// password 를 해독하는 작업 필요
				console.log("password >>>>",password)
				User.login({email:username, password})
					.then((UserData) => {
					console.log(">>>>UserData",UserData)
						if (!UserData) {
							return done(null, false, {
								message: 'Incorrect email or password.',
							});
						}
						const { email, password, studentId, name } = UserData
						return done(null, { email, password, studentId, name });
					})
					.catch((err) => done(err));
			}
		)
	);

	//JWT Strategy
	passport.use(
		new JWTStrategy(
			{
				jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
				secretOrKey: process.env.JWT_SECRET,
			},
			function (jwtPayload, done) {
				return UserModel.findOneById(jwtPayload.id)
					.then((user) => {
						return done(null, user);
					})
					.catch((err) => {
						return done(err);
					});
			}
		)
	);
};