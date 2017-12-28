const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const db             = require('./config/db');
const app            = express();

let episodes = require('./routes/episodes');
let users = require('./routes/users');
const port = 8000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/episodes', episodes);
app.use('/users', users);

app.listen(port, () => {
    console.log('We are live on ' + port);
});