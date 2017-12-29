const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const config = require('config');
const port = 8000;

// Configuring the Database Connection
let options = {
    server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } }
};

//Connect to database
mongoose.connect(config.DBHost, options);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//do not show logs in test environment
if(config.util.getEnv('NODE_ENV') !== 'test') {
    //morgan to output logs to the console
    app.use(morgan('combined')); //'combined' outputs apache style logs
}

let books = require('./app/routes/book');
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/books', books);
app.listen(port, () => {
    console.log('We are live on ' + port);
    console.log('Running on mode ', process.env.NODE_ENV);
});

module.exports = app;