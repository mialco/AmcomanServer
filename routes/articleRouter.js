var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Articles = require('../models/articles');
var Verify = require('./verify');


var articleRouter = express.Router();
articleRouter.use(bodyParser.json());

articleRouter.route('/')
// .get(Verify.verifyAdmin, function (req, res, next) {    
    // Dishes.find({}, function (err, dish) {
        // if (err) throw err;
        // res.json(dish);
    // });
// })
.get(Verify.verifyOrdinaryUser,Verify.verifyAdmin,function (req, res, next) {    
    Articles.find({}, function (err, art) {
        if (err) next(err);
		console.log('getting Articles');
		//res.append('Access-Control-Allow-Origin','*');
		if(! art){
			res.send('Cannot find any Articles in the database');
		} else {
			console.log('Sending back Articles');
			res.json(art);
		}
 });
})

//.post(Verify.verifyAdmin, function (req, res, next) {
.post(Verify.verifyOrdinaryUser,Verify.verifyAdmin,function (req, res, next) {
    Articles.create(req.body, function (err, art) {
        if (err)  next(err);
		try{
			if(typeof(art) !== 'undefined')
			{
				var id = art._id;
				console.log('Article created!');
				res.writeHead(200, {
					'Content-Type': 'text/plain'
				});
				res.end('Added the article with id: ' + id);
			}else{
				res.status(500).send('Failed to create new Article');
			}			
		}catch(newErr){
			console.log('exception creating a new article');
			next(newErr);
		}
    });
})

//.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
// .delete(function (req, res, next) {
    // Articles.remove({}, function (err, resp) {
        // if (err) next (err);
        // res.json(resp);
    // });
// });

articleRouter.route('/:artId')
.get(Verify.verifyOrdinaryUser,Verify.verifyAdmin,function (req, res, next) {
	console.log('Requesting one article: ID=  ' + req.params.artId );
		Articles.findById(req.params.artId , function (err, art) {
			if (err) next(err);
				try{
					res.json(art);
				}catch(err) {
					console.log('Error captured on get article by id');
				}
    });
})

.put(Verify.verifyOrdinaryUser,Verify.verifyAdmin,function (req, res, next) {
    console.log('PUT has been invoked for art id: ' + req.params.artId);
	Articles.findByIdAndUpdate(req.params.artId, {
		$set: req.body
		},{
		new: true
		}, function (err, art) {
        if (err) next (err);
        res.json(art);
    });
})

.delete(Verify.verifyOrdinaryUser,Verify.verifyAdmin,function (req, res, next) {
	console.log('Deleting article id: '  + req.params.artId );
    Articles.findByIdAndRemove(req.params.artId, function (err, resp) { 
	if (err) next( err);
		console.log('article Deleted');
        res.json(resp);
    });
});


module.exports = articleRouter;