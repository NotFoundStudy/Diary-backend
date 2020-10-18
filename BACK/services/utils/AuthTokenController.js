require('dotenv').config();
import jwt from 'jsonwebtoken';
import passport from 'passport';
import winston from '@config/winston';

exports.create = function (req, res) {
	passport.authenticate('local', { session: false }, (err, user) => {
		if (err) {
			return res.status(500).json({
				message: 'Server Error',
				error: '0002',
				data: false,
			});
		}
		if (!user) {
			return res.status(400).json({
				message: 'User not found!',
				error: '1001',
				data: false,
			});
		}
		req.login(user, { session: false }, (err) => {
			if (err) {
				winston.error(err);
				res.send(err);
			}
			// jwt.sign('token내용', 'JWT secretkey')
			const { email, name, confirmation, roles, studentId } = user;
			const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET);
			return res.json({
				data: { email, name, confirmation, roles, studentId },
				token,
				message: 'login success',
			});
		});
	})(req, res);
};