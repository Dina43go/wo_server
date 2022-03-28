// #constantes::

require('dotenv').config();
const express = require('express');
const app = express();

// # Logs::
const {requestLog} = require('./middlewares/logs');
app.use(requestLog);

// # Routes::

app.use('/' , require('./routes/testRoute'));

const $_PORT = process.env.API_PORT || 5050;
app.listen($_PORT , ()=> console.log(`le serveur a démaré sur ${process.env.API_URL}:${$_PORT}`));