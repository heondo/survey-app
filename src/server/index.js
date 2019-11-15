const http = require('http');
const express = require('express');

const app = express();

const usersRoute = require('./routes/users');

app.use('/api/users', usersRoute);

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
