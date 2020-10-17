const jwt = require('jsonwebtoken');
const passport = require('passport');
require('dotenv').config();

exports.create = function (req, res) {
	passport.authenticate('jwt', {session: false}, (err, user) => {
		if(!user.email) {
			passport.authenticate('local', {session: false}, (err, user) => {
				console.log('autheticate local')
				if (err || !user.email) {
					return res.status(400).json({
						message: 'Login Fail',
						user   : user
					});
				}
				else {
					// jwt.sign('token내용', 'JWT secretkey')
					const token = jwt.sign('nexus2493', process.env.JWT_SECRET);
					console.log(token,'aaaaaaaaaaaaaaaaaaaaaaaaaaa')
					window.localStorage.setItem('token', token);
					return res.json({user, token});
				}
			})(req,res)
		}
	})(req,res)
};