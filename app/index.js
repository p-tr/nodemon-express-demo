const express = require('express');
const uuid = require('uuid');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

// Qu'est-ce qu'un middleware ?
//  Fonction qui prend 3 paramétres :
//    req, res, next
//  req   : requête entrante
//  res   : réponse sortante
//  next  : itérateur pour passer au middleware suivant

// <- middleware-factory qui prend des paramètres libres (ou aucun)
const reqid = (v1 = false) => {
  // <- middleware renvoyé comme valeur de retour de la fonction reqid()
  return (async (req, res, next) => {
    req.uuid = v1 ? uuid.v1() : uuid.v4();
    req.uuid_type = v1 ? 'v1' : 'v4';
    next();
  });
};

// Brancher un middleware
//  app.use(middleware) => au global

app.use([
  reqid(),

  cors(),
  helmet(),

  express.urlencoded({ extended: false }),
  express.json()
]);

// enregistre dans le router expressjs la route '/' et y associe le callback
// final (contrôleur) présent en 2e paramètre
app.get('/', async (req, res) => {
  //res.send(`Hello World ! (request id = ${req.uuid}) [${req.uuid_type}]`).end();
  res.json({
    message: 'Hello World !',
    uuid: req.uuid,
    uuid_type: req.uuid_type
  });
});

app.get('/hello/:name', async (req, res) => {
  res.send(`Hello ${req.params.name} ! (request id = ${req.uuid}) [${req.uuid_type}]`).end();
});

app.all('/headers', async (req, res) => {
  const { headers, body, query } = req;
  res.json({ headers, body, query });
});

module.exports = { app }
