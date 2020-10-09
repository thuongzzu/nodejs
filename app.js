const express = require("express");
const path = require("path");
const http = require("http");
const logger = require('morgan');
const bodyParser = require("body-parser");

const index = require('./Route/index');
const dishRouter = require("./Route/dishRouter");
const leaderRouter = require("./Route/leaderRouter");
const promotionsRouter = require("./Route/promotionsRouter");
const usersRouter = require("./Route/userRoute");

const cookieParser = require("cookie-parser");
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const mongoose = require('mongoose');
const { Buffer } = require("buffer");
const passport = require('passport');
const authenticate = require('./authenticate');
const config = require('./config');
const app = express();

const url = config.mongoUrl;
const connect = mongoose.connect(url);
const port = 3000;

connect.then((db) => {
    console.log("Connected correctly to server");
}, (err) => { console.log(err); });

// Set views engine 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use(cookieParser('12345-67890-05225-50832'));
// app.use(session({
//     name: 'session-id',
//     secret: '12345-67890-05225-50832',
//     saveUninitialized: false,
//     resave: false,
//     store: new FileStore(),
// }));


app.use(passport.initialize());
//app.user(passport.session());
app.use('/', index);
app.use('/user', usersRouter);

// function auth (req, res, next) {
//   console.log(req.user);

//   if (!req.user) {
//     var err = new Error('You are not authenticated!');
//     res.setHeader('WWW-Authenticate', 'Basic');                          
//     err.status = 401;
//     next(err);
//   }
//   else {
//         next();
//   }
// }

// app.use(auth);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/dishes', dishRouter);
app.use('/leaders', leaderRouter);
app.use('/promotions', promotionsRouter);


app.listen(port, () => {
    console.log("connect server at: " + port);
});

//catch 404 error and forward to error handling
app.use((req, res, next)=>{
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

