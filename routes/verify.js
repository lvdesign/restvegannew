var User = require('../models/user');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config.js');

exports.getToken = function (user) {
    return jwt.sign(user, config.secretKey, {
        expiresIn: 3600 //time 1 hours
    });
};

/*
* USERS ORDINARY
*/
exports.verifyOrdinaryUser = function (req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, config.secretKey, function (err, decoded) {
            if (err) {
                var err = new Error('---You are not authenticated USER -- error decoded !');
                err.status = 401;
                return next(err);
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else {
        // if there is no token
        // return an error
        var err = new Error('---No token provided USER -- error decoded !');
        err.status = 403;
        return next(err);
    }
};

/*
* USERS ADMIN
*/

exports.verifyAdminUser = function(req, res, next) {

// verifies secret and checks exp
    if (!req.decoded) {
        var err = new Error('--- You are not authenticated!-- error decoded ');
        err.status = 403;
        return next(err);
    } else {
        // They are an admin
        var id = req.decoded._id;
        
        if (!req.decoded.admin) {
            var err = new Error('---You are not authorized to perform this operation ADMIN! -- req decode error');
            err.status = 403;
            return next(err);
        } else {
            next();
        }
    }
};