const { app } = require('./app');

// lance le serveur expressjs
app.listen(3000, () => {
  console.log("Listening on port 3000...");
});
