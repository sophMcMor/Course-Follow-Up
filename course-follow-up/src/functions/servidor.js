const serverless = require('serverless-http');
const app = require('../api/api'); // Importa tu aplicación Express desde api.js

exports.handler = serverless(app);