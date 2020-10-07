const express = require("express");
const bodyParser = require("body-parser");
const Promotions = require("../models/promotion");
const promotionsRouter = express.Router();

promotionsRouter.use(bodyParser.json());

promotionsRouter.route('/')
    .get((req, res, next) => {
        Promotions.find({}).then((promotions) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotions);
        }, err => next(err)).catch(err => next(err));
    })
    .post((req, res, next) => {
        Promotions.create(req.body).then((promotion) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotion);
        }, (err) => next(err)).catch((err) => next(err));
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /promotions');
    })
    .delete((req, res, next) => {
        Promotions.remove({}).then((resp) => {
            console.log('Deleted completely ', promotion);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err)).catch((err) => next(err));
    });

promotionsRouter.route('/:promotionID')
    .get((req, res, next) => {
        Promotions.findById(req.params.promotionID).then((promotion) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotion);
        }, (err) => next(err))
            .catch((err) => next(err));
    }).post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /Promotions/' + req.params.promotionId);
    }).put((req, res, next) => {
        Promotions.findByIdAndUpdate(req.params.promotionID, { $set: req.body }).then((promotion) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotion);
        }, (err) => next(err))
            .catch((err) => next(err));
    }).delete((req, res, next) => {
        Promotions.findByIdAndRemove(req.params.promotionID).then(resp => {
            console.log('Deleted completely ', promotion);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp)
        }, (err) => next(err)).catch((err) => next(err));
    });

module.exports = promotionsRouter;