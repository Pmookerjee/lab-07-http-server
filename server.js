'use strict';
require('dotenv').config();

const server = require('./lib/_server');

server.start(process.env.PORT, () => console.log("Server up at", process.env.PORT));
