// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Recipe = require('./recipes');
var User = require('./user');
//
var favoriteSchema = new Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    recipes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe'
    }]
}, {
    timestamps: true

});

var Favorites = mongoose.model('Favorite', favoriteSchema);
module.exports = Favorites;
