const admin = require('../config/firebase-config');
class Middleware {
	async decodeToken(req, res, next) {
		const token = req.headers.authorization.split(' ')[1];
		try {
			const decodeValue = await admin.auth().verifyIdToken(token);
			if (decodeValue) {
				req.user = decodeValue;
				// console.log(req.user)
				return next();
			}
			return res.json({ message: 'Un authorized : Login with proper Token' });
		} catch (e) {
			console.log(e)
			res.status(500).json({msg:"Internal Server Error : Auth Middleware"})
		}
	}
}

module.exports = new Middleware();