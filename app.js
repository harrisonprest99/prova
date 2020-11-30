require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const filmsRoute = require('./URI/films.js');
const prenotazioniRoute = require('./URI/prenotazioni.js');
const saleRoute = require('./URI/sale.js');
const infofilmsRoute = require('./URI/infofilms.js');
const utentiRoute = require('./URI/utenti.js');
const recensioniRoute = require('./URI/recensioni.js');

// configurazione del body-parser
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

// gestione errori CORS
app.use(cors());

// URI film
app.use('/films', filmsRoute);

// URI prenotazioni
app.use('/prenotazioni', prenotazioniRoute);

// URI sale
app.use('/sale', saleRoute);

// URI infofilms
app.use('/infofilms' , infofilmsRoute);

// URI utenti
app.use('/utenti' , utentiRoute);

// URI recensioni
app.use('/recensioni' , recensioniRoute);

app.use('/', express.static('static'));
app.use('/films', express.static('static'));

module.exports = app;
