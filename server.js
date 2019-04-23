const express = require('express');
const logger = require('morgan');
const users = require('./routes/users');
const stock = require('./routes/stock');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const jwtMiddleware = require('./app/api/middleware/jwt');
const mongoose = require('./config/database'); //database configuration
const config = require('./config/app.json');
const app = express();
const HttpStatus = require('http-status-codes');

app.set('secretKey', config.jwt.jwtSecretKey); // jwt secret token

// connection to mongodb
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(expressValidator());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));

//CORS
app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if (req.method === 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});


// public route
app.use('/users', users);

// public route
app.use('/stock', jwtMiddleware, stock);


app.get('/favicon.ico', function (req, res) {
    res.sendStatus(204);
});


// express doesn't consider not found 404 as an error so we need to handle 404 it explicitly
// handle 404 error
app.use(function (req, res) {
    res.status(HttpStatus.NOT_FOUND).json({status:HttpStatus.NOT_FOUND,message: "Page not found."});
});

// handle errors
app.use(function (err, req, res) {
    console.log(err);

    if (err.status === HttpStatus.NOT_FOUND)
        res.status(HttpStatus.NOT_FOUND).json({status: HttpStatus.NOT_FOUND, message: "Not found."});
    else
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: "Something is wrong."});

});

app.listen(config.app.port, function () {
    console.log('Node server listening on port: ' + config.app.port);
});
