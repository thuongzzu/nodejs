const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
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

const app = express();

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);
const port = 3000;

connect.then((db) => {
    console.log("Connected correctly to server");
}, (err) => { console.log(err); });


app.use(cookieParser('12345-67890-05225-50832'));
app.use(session({
    name: 'session-id',
    secret: '12345-67890-05225-50832',
    saveUninitialized: false,
    resave: false,
    store: new FileStore(),
}));

app.use('/user', usersRouter);
app.use(passport.initialize());
app.use(passport.session());

function auth(req, res, next) {
    console.log(req.user);
    if (!req.user) {
        var err = new Error('You are not authenticated !');
        err.status = 403;
        next(err);
    } else {
        next();
    }
}

app.use(auth);


app.use('/dishes', dishRouter);
app.use('/leaders', leaderRouter);
app.use('/promotions', promotionsRouter);


app.use(bodyParser.json());
app.use((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.send("<h1>SERVER EXPRESS</h1>")
});

app.listen(port, () => {
    console.log("connect server at: " + port);
});