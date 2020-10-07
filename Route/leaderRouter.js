const express = require("express");
const bodyParser = require("body-parser");
const Leaders = require("../models/leader")
const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
    .get((req, res, next) => {
        Leaders.find({}).then((leaders) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leaders);
        }, err => next(err)).catch(err => next(err));
    })
    .post((req, res, next) => {
        Leaders.create(req.body).then((leader) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader);
        }, (err) => next(err)).catch((err) => next(err));
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /Leaders');
    })
    .delete((req, res, next) => {
        Leaders.remove({}).then((resp) => {
            console.log('Deleted completely ', leader);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp)
        }, (err) => next(err)).catch((err) => next(err));
    });

leaderRouter.route('/:leaderID')
    .get((req, res, next) => {
        Leaders.findById(req.params.leaderID).then((leader) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader);
        }, (err) => next(err))
            .catch((err) => next(err));
    }).post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /Leaders/' + req.params.leaderId);
    }).put((req, res, next) => {
        Leaders.findByIdAndUpdate(req.params.leaderID, { $set: req.body }).then((leader) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader);
        }, (err) => next(err))
            .catch((err) => next(err));
    }).delete((req, res, next) => {
        Leaders.findByIdAndRemove(req.params.leaderID).then(resp => {
            console.log('Deleted completely ', leader);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp)
        }, (err) => next(err)).catch((err) => next(err));
    });


module.exports = leaderRouter;