import passport from 'passport';
import passportJWT from 'passport-jwt';
import User from '@db/model/users';
import { Strategy as LocalStrategy } from 'passport-local';
import winston from '@config/winston';
import { loginSchema as loginValidation } from '../validation/schema';

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

require('dotenv').config();

// https://github.com/jaredhanson/passport-local
module.exports = () => {
	// Local Strategy
	passport.use(
		new LocalStrategy(
			{
				/* FE에서 input tag의  name = userId 사용해야 함 */
				usernameField: 'userId',
				passwordField: 'password',
			},
			async function (username, password, done) {
				console.log(username,'>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
				User.login({ email: username, password })
					.then((user) => {
						if (!user) {
							winston.warn('err[1001] User not founded!!');
							return done(null, false, {
								error: '1001',
								message: 'User not founded!!',
								data: null,
							});
						}
						return done(null, user);
					})
					.catch((err) => {
						winston.error('err[0002] DATABASE request error,',err.message);
						return done(err);
					});
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
				User.findByEmail(jwtPayload.email)
					.then((user) => {
						return done(null, user);
					})
					.catch((err) => {
						winston.error('err[0002] DATABASE request error,',err.message);
						return done(err);
					});
			}
		)
	);
};