const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Dishes = require("../models/dishes");
const authenticate = require('../authenticate');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
    .get((req, res, next) => {
        Dishes.find({}).populate('comments.author').then((dishes) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dishes);
        }, err => next(err)).catch(err => next(err));
    })
    .post(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
        Dishes.create(req.body).then((dish) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish);
        }, (err) => next(err)).catch((err) => next(err));
    })
    .put(authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes');
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
        Dishes.remove({}).then((resp) => {
            console.log('Deleted completely ', dish);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err)).catch((err) => next(err));
    });

dishRouter.route('/:dishID')
    .get((req, res, next) => {
        Dishes.findById(req.params.dishID).populate('comments.author').then((dish) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish);
        }, (err) => next(err))
            .catch((err) => next(err));
    }).post(authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /dishes/' + req.params.dishId);
    }).put(authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
        Dishes.findByIdAndUpdate(req.params.dishID, { $set: req.body }).then((dish) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish);
        }, (err) => next(err))
            .catch((err) => next(err));
    }).delete(authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
        Dishes.findByIdAndRemove(req.params.dishID).then(resp => {
            console.log('Deleted completely ', dish);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp)
        }, (err) => next(err)).catch((err) => next(err));
    });

dishRouter.route('/:dishID/comments')
    .get((req, res, next) => {
        Dishes.findById(req.params.dishID).populate('comments.author').then((dish) => {
            if (dish !== null) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish.comments);

            } else {
                err = new Error('Dish ' + req.params.dishID + ' not found');
                res.status = 404;
                return next(err);
            }
        }, err => next(err)).catch(err => next(err));
    })
    .post(authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
        Dishes.findById(req.params.dishID).then((dish) => {
            if (dish !== null) {
                req.body.author = req.user._id;
                dish.comments.push(req.body);
                dish.save().then((dish) => {
                    console.log(dish)
                    Dishes.findById(dish._id)
                        .populate('comments.author')
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        })
                }, err => next(err));
            } else {
                err = new Error('Dish ' + req.params.dishID + ' not found');
                res.status = 404;
                return next(err);
            }
        }, (err) => next(err)).catch((err) => next(err));
    })
    .put(authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes ' + req.params.dishID + ' /comment');
    })
    .delete(authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
        Dishes.findById(req.params.dishID).then((dish) => {
            if (dish !== null) {
                for (var i = (dish.comments.length - 1); i >= 0; i--) {
                    dish.comments.id(dish.comments[i]._id).remove();
                }
                dish.save().then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);
                }, err => next(err));
            } else {
                err = new Error('Dish ' + req.params.dishID + ' not found');
                res.status = 404;
                return next(err);
            }
        }, (err) => next(err)).catch((err) => next(err));
    });

dishRouter.route('/:dishID/comments/:commentId')
    .get((req, res, next) => {
        Dishes.findById(req.params.dishID).populate('comments.author').then((dish) => {
            if (dish !== null && dish.comments.id(req.params.commentId) !== null) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish.comments.id(req.params.commentId));
                dish.save().then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments.id(req.params.commentId));
                }, err => next(err));
            } else if (dish === null) {
                err = new Error('Dish ' + req.params.dishID + ' not found');
                res.status = 404;
                return next(err);
            } else {
                err = new Error('Comment ' + req.params.comments + ' not found');
                res.status = 404;
                return next(err);
            }
        }, (err) => next(err))
            .catch((err) => next(err));
    }).post(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /dishes/' + req.params.dishId + '/comments/' + req.params.commentId);
    }).put(authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
        Dishes.findById(req.params.dishID).then((dish) => {
            if (dish !== null && dish.comments.id(req.params.commentId) !== null) {
                if (req.body.rating) {
                    dish.comments.id(req.params.commentId).rating = req.body.rating
                }
                if (req.body.comments) {
                    dish.comments.id(req.params.commentId).comments = req.body.comments
                }
                dish.save().then((dish) => {
                    Dishes.findById(dish._id).populate('comments.author').then((dish) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(dish.comments.id(req.params.commentId));
                    })
                })
            } else if (dish === null) {
                err = new Error('Dish ' + req.params.dishID + ' not found');
                res.status = 404;
                return next(err);
            } else {
                err = new Error('Comment ' + req.params.comments + ' not found');
                res.status = 404;
                return next(err);
            }
        }, (err) => next(err))
            .catch((err) => next(err));
    }).delete(authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
        Dishes.findById(req.params.dishID).then((resp) => {
            if (dish !== null && dish.comments.id(req.params.commentId) !== null) {
                dish.comments.id(req.params.commentId).remove();
                dish.save().then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);
                }, err => next(err));
            } else if (dish === null) {
                err = new Error('Dish ' + req.params.dishID + ' not found');
                res.status = 404;
                return next(err);
            } else {
                err = new Error('Comment ' + req.params.comments + ' not found');
                res.status = 404;
                return next(err);
            }
        }, (err) => next(err)).catch((err) => next(err));
    });
module.exports = dishRouter;