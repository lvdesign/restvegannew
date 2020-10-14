var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Recipes = require('../models/recipes');

var Verify = require('./verify');

var recipeRouter = express.Router();
recipeRouter.use(bodyParser.json());



/*
*   RECIPE /id
*
*   get open to read  -> allbody
*   put or post       -> users
*   delete          -> users/admin
*/

recipeRouter.route('/')

.get( function(req,res,next){
    //res.end('Will send all recipes');   arrayof recipe, req.query property
    Recipes.find(req.query)
        .populate('comments.postedBy')
        .exec(function(err, recipe){
            if(err) next (err);
            res.json(recipe);
        });
})

.post(Verify.verifyOrdinaryUser,function(req,res,next){
    // res.end('Will add new recipes toto :: ' + req.body.name + ' with details :::: ' + req.body.description );    
    Recipes.create(req.body, function(err, recipe){
        if(err) next (err);
        console.log('Recipe created');

        var id = recipe._id;
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });

        res.end('added the recipe id :: ' +id ); 
    });

})

.delete( Verify.verifyOrdinaryUser, Verify.verifyAdminUser,function(req,res,next){
   //res.end('Delete all recipes'); 
   Recipes.remove({}, function(err, resp){
        if(err) next (err);
        res.json(resp);
    });  
});



/*
*  RECIPE /id
*
*   get open to read  -> allbody
*   put or post       -> users
*   delete          -> users/admin
*/
recipeRouter.route('/:recipeId')

.get( function(req,res,next){
   //res.end('Will add new recipes: ' + req.params.recipeId + ' OK ' );
   Recipes.findById(req.params.recipeId)
        .populate('comments.postedBy')
        .exec( function(err, recipe){
            if(err) next (err);
            res.json(recipe);
        });   
})

.put(Verify.verifyOrdinaryUser,function(req,res,next){
    //res.write('Updating :' + req.params.recipeId + '\n');
   //res.end('Will Update new recipes: ' + req.body.name + ' with details: ' + req.body.description );    
    Recipes.findByIdAndUpdate(req.params.recipeId,{
        $set: req.body
    },{
        new:true
    }, function(err,recipe){
        if(err) next (err);
        res.json(recipe);
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdminUser,function(req,res,next){
   //res.end('Delete this recipes: '+ req.params.recipeId );  
   Recipes.findByIdAndRemove(req.params.recipeId, function(err,resp){
      if(err) next (err);
        res.json(resp);
   });
});

//comments
recipeRouter.route('/:recipeId/comments')

    .get(function (req, res, next) {
        Recipes.findById(req.params.recipeId)
            .populate('comments.postedBy')
            .exec(function (err, recipe) {
                if (err) next(err);
                res.json(recipe.comments);
            });
    })

    .post( Verify.verifyOrdinaryUser, function (req, res, next) {
        Recipes.findById(req.params.recipeId, function (err, recipe) {
            if (err) next(err);
            //
            req.body.postedBy = req.decoded._id; 
            console.log(req.body.postedBy);
             console.log(req.body);
            
            recipe.comments.push(req.body);
            recipe.save(function (err, recipe) {
                if (err) next(err);
                console.log('Updated Comments!');
                res.json(recipe);
            });
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdminUser, function (req, res, next) {
        Recipes.findById(req.params.recipeId, function (err, recipe) {
            if (err) next(err);
            for (var i = (recipe.comments.length - 1); i >= 0; i--) {
                recipe.comments.id(recipe.comments[i]._id).remove();
            }
            recipe.save(function (err, result) {
                if (err) next(err);
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end('Deleted all comments!');
            });
        });
    });

//
recipeRouter.route('/:recipeId/comments/:commentId')

    .get(Verify.verifyOrdinaryUser, function (req, res, next) {
        Recipes.findById(req.params.recipeId)

            .populate('comments.postedBy')
            .exec(function (err, recipe) {
                if (err) next(err);
                res.json(recipe.comments.id(req.params.commentId));
            });
    })

    .put(Verify.verifyOrdinaryUser, function (req, res, next) {
        // We delete the existing commment and insert the updated
        // comment as a new comment
        Recipes.findById(req.params.recipeId, function (err, recipe) {
            if (err) next(err);
            recipe.comments.id(req.params.commentId).remove();
            req.body.postedBy = req.decoded._id;
            recipe.comments.push(req.body);
            recipe.save(function (err, recipe) {
                if (err) next(err);
                console.log('Updated Comments!');
                res.json(recipe);
            });
        });
    })

    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Recipes.findById(req.params.recipeId, function (err, recipe) {
            if (recipe.comments.id(req.params.commentId).postedBy != req.decoded._id) {
                var err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
            recipe.comments.id(req.params.commentId).remove();
            recipe.save(function (err, resp) {
                if (err) next(err);
                res.json(resp);
            });
        });
    });

module.exports = recipeRouter;