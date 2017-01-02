var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Entities = require('../models/entities');
var Verify = require('./verify');


var entityRouter = express.Router();
entityRouter.use(bodyParser.json());

entityRouter.route('/')
// .get(Verify.verifyAdmin, function (req, res, next) {    
    // Dishes.find({}, function (err, dish) {
        // if (err) throw err;
        // res.json(dish);
    // });
// })
.get(Verify.verifyOrdinaryUser,Verify.verifyAdmin,function (req, res, next) {    
    Entities.find({}, function (err, ent) {
        if (err) next(err);
		console.log('getting Entities');
		//res.append('Access-Control-Allow-Origin','*');
		if(! ent){
			res.send('Cannot find any entities in the database');
		} else {
			console.log('Sending back entities');
			res.json(ent);
		}
 });
})

//.post(Verify.verifyAdmin, function (req, res, next) {
.post(Verify.verifyOrdinaryUser,Verify.verifyAdmin,function (req, res, next) {
    Entities.create(req.body, function (err, ent) {
        if (err)  next(err);
		try{
			if(typeof(ent) !== 'undefined')
			{
				var id = ent._id;
				console.log('Entity created!');
				res.writeHead(200, {
					'Content-Type': 'text/plain'
				});
				res.end('Added the entity with id: ' + id);
			}else{
				res.status(500).send('Failed to create new Entity');
			}			
		}catch(newErr){
			console.log('exception creating a new entity');
			next(newErr);
		}
    });
})

//.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
// .delete(function (req, res, next) {
    // Entities.remove({}, function (err, resp) {
        // if (err) next (err);
        // res.json(resp);
    // });
// });

entityRouter.route('/:entId')
.get(Verify.verifyOrdinaryUser,Verify.verifyAdmin,function (req, res, next) {
	console.log('Requesting one emtity: ID=  ' + req.params.entId );
		Entities.findById(req.params.entId , function (err, ent) {
			if (err) next(err);
				try{
					res.json(ent);
				}catch(err) {
					console.log('Error captured on get entity by id');
				}
    });
})

.put(Verify.verifyOrdinaryUser,Verify.verifyAdmin,function (req, res, next) {
    console.log('PUT has been invoked for ent id: ' + req.params.entId);
	Entities.findByIdAndUpdate(req.params.entId, {
		$set: req.body
		},{
		new: true
		}, function (err, ent) {
        if (err) next (err);
        res.json(ent);
    });
})

.delete(Verify.verifyOrdinaryUser,Verify.verifyAdmin,function (req, res, next) {
	console.log('Deleting entitu id: '  + req.params.entId );
    Entities.findByIdAndRemove(req.params.entId, function (err, resp) { 
	if (err) next( err);
		console.log('Entity Deleted');
        res.json(resp);
    });
});


module.exports = entityRouter;