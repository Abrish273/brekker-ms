const dotenv = require('dotenv');
const cfg = {};

dotenv.config();

// cfg.port = process.env.PORT || 5000;

cfg.type = process.env.type;
cfg.project_id = process.env.project_id;
cfg.private_key_id = process.env.private_key_id;
cfg.private_key = process.env.private_key.replace(/\\n/g, '\n');
cfg.client_email = process.env.client_email;
cfg.client_id = process.env.client_id;
cfg.auth_uri = process.env.auth_uri;
cfg.token_uri = process.env.token_uri;
cfg.auth_provider_x509_cert_url = process.env.auth_provider_x509_cert_url;
cfg.client_x509_cert_url = process.env.client_x509_cert_url;

module.exports = cfg;