var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Entities = require('../models/entities');
var Orgs = require('../models/organizations');
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
.get(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Entities.find({}, function (err, ent) {
        if (err) next(err);
        console.log('getting Entities');
        //res.append('Access-Control-Allow-Origin','*');
        if (!ent) {
            res.send('Cannot find any entities in the database');
        } else {
            console.log('Sending back entities');
            res.json(ent);
        }
    });
})

//.post(Verify.verifyAdmin, function (req, res, next) {
.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Entities.create(req.body, function (err, ent) {
        if (err) next(err);
        try {
            if (typeof (ent) !== 'undefined') {
                var id = ent._id;
                console.log('Entity created!');
                res.json(ent);
            } else {
                res.status(500).send('Failed to create new Entity');
            }
        } catch (newErr) {
            console.log('exception creating a new entity');
            next(newErr);
        }
    });
})

entityRouter.route('/:entId')
.get(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    console.log('Requesting one entity: ID=  ' + req.params.entId);
    Entities.findById(req.params.entId, function (err, ent) {
        if (err) next(err);
        try {
            res.json(ent);
        } catch (err) {
            console.log('Error captured on get entity by id');
        }
    });
})

.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    console.log('PUT has been invoked for ent id: ' + req.params.entId);
    Entities.findByIdAndUpdate(req.params.entId, {
        $set: req.body},{
        new: true }, function (err, ent) {
            if (err) next(err);
            res.json(ent);
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    console.log('Deleting entitu id: ' + req.params.entId);
    Entities.findByIdAndRemove(req.params.entId, function (err, resp) {
        if (err) next(err);
        console.log('Entity Deleted');
        res.json(resp);
    });
});

entityRouter.route('/notinorg/:orgId')
.get(function (req, res, next) {
    var orgId = req.params.orgId;
    console.log('Getting entities not in organization : ' + orgId);
    try {
        Orgs.findById(orgId, function (err, org) {

            if (err) next(err)
                if (!org || org.entities.count === 0) {
                    console.log('Organization id : ' + orgId + ' does not exist or has no entities. Returning all the entities');
                    Entities.find({}, function (err, ent) {
                        if (err) {
                            console.log('Invoking next error');
                            next(err)
                            console.log('returned from next error');
                        };
                        console.log('Returning all the entities after error handler');
                        if (!ent) {
                            res.json({});
                            resend('no entities found');
                        } else {
                            res.json(ent);
                        }
                    });
                } else {
                    console.log('Returning entities not found in Organization id : ' + orgId);
                    Entities.find({ _id: { $nin: org.entities } }, function (err, ent) {
                        if (err) next(err);
                        if (!ent) {
                            res.json({});
                        } else {
                            res.json(ent);
                        }
                    });
                }
        });
    } catch (er) {
        console.log('Error caught while geting the intities not in organization');
        console.log(er);
        next(er);
    }
}
);



module.exports = entityRouter;