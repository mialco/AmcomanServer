var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user');
var Verify = require('./verify');
router.use(bodyParser.json());



/* GET users listing. */
router.route('/')
.get(Verify.verifyOrdinaryUser,Verify.verifyAdmin,   function (req, res, next) {
    User.find({}, function (err, user) {
        if (err) {
			console.log('User must be autheticated to run this command');
			return;
		}
        res.json(user);
    });
});


router.post('/register', function(req, res) {
	console.log('registration started');
	console.log ('UserName: ' + req.body.username + ' is admin:  ' + req.body.registerAdmin);
    User.register(new User({ username : req.body.username , admin: req.body.registerAdmin}),
      req.body.password, function(err, user)
	  {
        if (err) {
            return res.status(500).json({err: err});
        }
        passport.authenticate('local')(req, res, function () {
            return res.status(200).json({status: 'Registration Successful!'});
        });
    });
});

//		res.append('Access-Control-Allow-Origin','*');
router.all ('/login', function (req,res,next){
	console.log('Running users/login/ALL')
	//res.append('Access-Control-Allow-Origin','*');
	next();
})

router.post('/login', function(req, res, next) {
	console.log('Router.Post -->  Login started');
	//res.append('Access-Control-Allow-Origin','*');
	
	passport.authenticate('local', function(err, user, info) {
    console.log ('passport.post finished - user: '  + user + '  Info:    ' + info );
	if (err) {
		console.log('passport.post returned error');
      return next(err);
    }
    if (!user) {
		console.log('passport.authenticate renurned null useer')
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
        
      var token = Verify.getToken(user);
              res.status(200).json({
        status: 'Login successful!',
        success: true,
        token: token,
		admin: user.admin | false
      });
    });
  })(req,res,next);
});

router.get('/logout', function(req, res) {
    req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

module.exports = router;
