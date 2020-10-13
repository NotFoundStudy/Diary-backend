const { generateToken, decodeToken } = require('../token');

module.exports = (req, res, next) => {
	// cookie로 부터 access_token을 받습니다.
	const token = req.cookies.get('access_token');
	if (!token) {
		// if there is no token, skip!
		req.user = null;
		return next();
	}
	decodeToken(token).then((decoded) => {
		const { user } = decoded;

		// re-issue token when its age is over 3 days
		if (Date.now() / 1000 - decoded.iat > 60 * 60 * 24 * 3) {
			// const freshToken = await generateToken({ user }, 'user');

			generateToken({ user }, 'user').then((freshToken) => {
				req.cookies.set('access_token', freshToken, {
					maxAge: 1000 * 60 * 60 * 24 * 7,
					httpOnly: true,
				});
			});
		}

		req.user = user;

		return next();
	});
};