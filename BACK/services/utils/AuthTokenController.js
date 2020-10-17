const jwt = require('jsonwebtoken');
const passport = require('passport');
require('dotenv').config();
const localStorage = require('local-storage')

exports.create = function (req, res) {
	passport.authenticate('local', {session: false}, (err, user) => {
		console.log(">>>>user<<<<",user)
		if (err || !user) {
			return res.status(400).json({
				message: 'Login Fail',
				user   : user
			});
		}
		req.login(user, {session: false}, err =>{
			if(err) {
				res.send(err)
			}
			console.log("!!!!!!!!!!!!!!!!login success !!!!!!!!!!!!!!!!!!!")
			// jwt.sign('token내용', 'JWT secretkey')
			const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET);
			localStorage('token', token);
			console.log(">>>>token<<<<",localStorage('token'))
			return res.json({user, token, message: 'login success'});
		})
	
	})(req,res)
}
