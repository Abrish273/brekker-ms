const admin = require('firebase-admin');

const cfg = require('./config2');

admin.initializeApp({
	credential: admin.credential.cert(cfg),
});

module.exports = admin;