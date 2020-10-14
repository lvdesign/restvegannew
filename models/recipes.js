// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    
    postedBy: {
           type: mongoose.Schema.Types.ObjectId,
           ref: 'User'
       }
    }, {
    timestamps: true
});


// create a schema
//author avec postedBy mais ajouter populate to requete recipes !!!!
var recipeSchema = new Schema({
    author:{
        type: String,
        require:false
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    image:{
         type: String,
         require:false
    },
    category: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    method: {
        type: String,
        required: true
    },
    ingredients: {
        type: String,
        required: true
    },
    preparationtime: {
        type: String,
        require:true
    },
    cookingtime: {
        type: String,
        require:true
    },
    tips: {
        type: String,
        required: true
    },
    featured:{
        type:Boolean,
        default:false
    },
    comments: [commentSchema]
}, {
    timestamps: true
});


// the schema is useless so far
// we need to create a model using it
var Recipes = mongoose.model('Recipe', recipeSchema);

// make this available to our Node applications
module.exports = Recipes;