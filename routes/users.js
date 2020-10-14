var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user');
var Verify = require('./verify');


/* 
* USERS  GET users listing. 
*/
router.get('/',function(req, res, next) {

  //res.send('respond with a resource');

   User.find({}, function(err, user){
        if(err) throw err;
        res.json(user);
    });
});

/*
* USERS /REGISTER post
*/
router.post('/register', function(req, res) {
    User.register(new User({ username : req.body.username }),
        req.body.password, function(err, user) {
        if (err) {
            return res.status(500).json({err: err});
        }
                if(req.body.firstname) {
            user.firstname = req.body.firstname;
        }
        if(req.body.lastname) {
            user.lastname = req.body.lastname;
        }
                user.save(function(err,user) {
            passport.authenticate('local')(req, res, function () {
                return res.status(200).json({status: 'Registration Successful!'});
            });
        });
    });
});

/*
* USERS /LOGIN post
*/
router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log as user'
        });
      }

      console.log('--User in users:--', user);

      //var token = Verify.getToken(user); changeToken
       var token = Verify.getToken({"username":user.username, "_id":user._id, "admin":user.admin});
        res.status(200).json({
          status: 'Login successful! OK ',
          success: true,
          token: token
      });
    });
  })(req,res,next);//ok
});

/*
* USERS /LOGOUT
*/
router.get('/logout', function(req, res) {
    req.logout();
  res.status(200).json({
    status: 'ByeBye!'
  });
});


module.exports = router;
