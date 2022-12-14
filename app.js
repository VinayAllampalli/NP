var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
var routeConfig = require('./routesConfig/routes-config')

//routes initials
app.use('/api',routeConfig)



const client =require("./connections/db")
const port= 4000
app.listen(port,()=> console.log(`server listning on port ${port}`))
module.exports = app;
