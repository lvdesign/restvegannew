var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Favorites = require('../models/favorites');
var Verify = require('./verify');

var favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

/* Route '/' */

/*.all(Verify.verifyOrdinaryUser)*/
favoriteRouter.route('/')
    .get(function (req, res, next) {
        var userId = req.decoded._id
        //var userId = req.decoded._id;

        Favorites.find({
                postedBy: userId
            })
            .populate('postedBy recipes')
            .exec(function (err, recipe) {
                if (err) return next(err)
                res.json(recipe)
            })
    })

    .post(function (req, res, next) {
        var userId = req.decoded._id;//
        var recipeId = req.body._id;
        console.log('userId' + userId);
        console.log('recipeId' + recipeId);

        Favorites.update({
                postedBy: userId
            }, {
                $push: {
                    recipes: recipeId
                }
            }, {
                upsert: true
            },
            function (err, data) {
                if (err) return next(err)
                res.json(data)
            })
    })

    .delete(function (req, res, next) {
        var userId = req.decoded._id;//
        //        var userId = req.decoded._doc._id

        console.log(userId);

        Favorites.remove({
            postedBy: userId
        }, function (err, resp) {
            if (err) next(err)
            res.json(resp)
        })
    })

/*Verify.verifyOrdinaryUser, */
favoriteRouter
    .route('/:recipeId')


    //si admin
    .delete(function (req, res, next) {
        var userId = req.decoded._id;//
        
    Favorites.findOne({
                postedBy: userId
            },
            function (err, favorites) {
                if (err) throw err;
                var recipeId = req.params.recipeId;

                if (favorites.recipes != undefined) {
                    var index = favorites.recipes.indexOf(recipeId)
                    if (index > -1) {
                        favorites.recipes.splice(index);
                    }

                }
                favorites.save(function (err, favorites) {
                    if (err) throw err;
                    res.json(favorites);
                });
            });
    });

module.exports = favoriteRouter;
