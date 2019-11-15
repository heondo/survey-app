const http = require('http');
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

const usersRoute = require('./api/routes/users');
const surveysRoute = require('./api/routes/surveys');

app.use('/api/users', usersRoute);
app.use('/api/surveys', surveysRoute);

app.use((err, req, res, next) => {
  res.send({
    type: err.type,
    error: err.message
  });
});

const port = process.env.PORT;
const server = http.createServer(app);

server.listen(port, () => {
  console.log('listening on port ' + port);
});
