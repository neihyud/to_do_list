const express = require('express');

const app = express();

const cors = require('cors');
app.use(cors());
app.use(express.json());

const mongodb = require('./src/connections/mongodb');

mongodb.connect();

const {port} = require('./src/config/index');

const route = require('./src/app.router');

app.use('/', route);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
