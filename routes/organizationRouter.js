var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Orgs = require('../models/organizations');
var Verify = require('./verify');


var orgRouter = express.Router();
orgRouter.use(bodyParser.json());

orgRouter.route('/')
// .get(Verify.verifyAdmin, function (req, res, next) {    
    // Dishes.find({}, function (err, dish) {
        // if (err) throw err;
        // res.json(dish);
    // });
// })
.get(Verify.verifyOrdinaryUser,Verify.verifyAdmin,function (req, res, next) {    
    console.log('POpulated entities');
	Orgs.find().populate('entities').exec( function (err, org) {
        if (err) next(err);
		console.log('getting Organizations');
		//res.append('Access-Control-Allow-Origin','*');
		if(! org){
			res.send('Cannot find any organizations in the database');
		} else {
			console.log('Sending back organizations');
			res.json(org);
		}
 });
})

//.post(Verify.verifyAdmin, function (req, res, next) {
.post(Verify.verifyOrdinaryUser,Verify.verifyAdmin,function (req, res, next) {
    Orgs.create(req.body, function (err, org) {
        if (err)  next(err);

        if (org) {
            console.log('Organization created!');
//            var id = org._id;

            //res.writeHead(200, {
            //    'Content-Type': 'text/plain'
            //});
            res.json(org)
            //res.end('Added the organization with id: ' + id);
        } else {
            //res.end('Failed tp add new Organization ');
        }
    });
})

orgRouter.route('/:orgId')
.get(Verify.verifyOrdinaryUser,Verify.verifyAdmin, function (req, res, next) {
	console.log('Requesting one organization: ID=  ' + req.params.orgId );
		Orgs.findById(req.params.orgId , function (err, org) {
			if (err) next(err);
				try{
					res.json(org);
				}catch(err) {
					console.log('Error captured on get organiztion by id');
				}
    });
})

.put(Verify.verifyOrdinaryUser,Verify.verifyAdmin, function (req, res, next) {
    console.log('PUT has been invoked for organization id: ' + req.params.orgId);
	Orgs.findByIdAndUpdate(req.params.orgId, {
		$set: req.body
		},{
		new: true
		}, function (err, org) {
        if (err) next (err);
        res.json(org);
    });
})

.delete(Verify.verifyOrdinaryUser,Verify.verifyAdmin, function (req, res, next) {
    console.log('Starting delete organization id = ' + req.params.orgId);
	Orgs.findByIdAndRemove(req.params.orgId, function (err, resp) { 
	if (err) next( err);
	else{
		console.log('Deleted organization id = ' + req.params.orgId);
        res.json(resp);
	}
    });
});


module.exports = orgRouter;