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
.get(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    console.log('Populated entities');
    Orgs.find().populate('entities').exec(function (err, org) {
        if (err) next(err);
        console.log('getting Organizations');
        //res.append('Access-Control-Allow-Origin','*');
        if (!org) {
            res.send('Cannot find any organizations in the database');
        } else {
            console.log('Sending back organizations');
            res.json(org);
        }
    });
})

//.post(Verify.verifyAdmin, function (req, res, next) {
.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Orgs.create(req.body, function (err, org) {
        if (err) next(err);

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
.get(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    console.log('Requesting one organization: ID=  ' + req.params.orgId);
    Orgs.findById(req.params.orgId).populate('entities').exec(function (err, org) {
        if (err) next(err);
        try {
            res.json(org);
        } catch (err) {
            console.log('Error captured on get organiztion by id');
        }
    });
})

.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    console.log('PUT has been invoked for organization id: ' + req.params.orgId);
    Orgs.findByIdAndUpdate(req.params.orgId, {
        $set: req.body
    }, {
        new: true
    }, function (err, org) {
        if (err) next(err);
        res.json(org);
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    console.log('Starting delete organization id = ' + req.params.orgId);
    Orgs.findByIdAndRemove(req.params.orgId, function (err, resp) {
        if (err) next(err);
        else {
            console.log('Deleted organization id = ' + req.params.orgId);
            res.json(resp);
        }
    });
});

orgRouter.route('/entity/:orgId/:entId')
.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    //try {
    var orgId = req.params.orgId;
    var entId = req.params.entId;
    var updatedOrg = {};
    console.log('PUT has been invoked to add entity id' + entId + 'to organization id: ' + req.params.orgId);
    Orgs.findById(orgId, function (err, org) {
        if (err) next(err);
        console.log('no error after while retrieving org from db');
        //get the array and add the new entity ID to the entities
        if (org && org.entities && Array.isArray(org.entities)) {
            console.log('proceeding to update entities array');
            // if the entity does not exist in the orgamization, add id
            if (org.entities.indexOf(entId) === -1) {
                console.log('Adding entity to the entity array. ' + org.entities);
                org.entities.push(entId);
                updatedOrg = org;
                console.log('Added entity to the entity array. ' + updatedOrg.entities);
                console.log('Organization : ' + orgId + ' has been updated with  the entity id : ' + entId);
                console.log('Updating the database with the organization : ' + orgId + ' and entity id : ' + entId);
                console.log('updating the database...');
                console.log('Updating the database with the organization : ' + orgId + ' and entity id : ' + entId);
                console.log('Updating the database with the organization entities : ' + updatedOrg._id + ' entities: ' + updatedOrg.entities);
                Orgs.findByIdAndUpdate(orgId, {
                    $set: updatedOrg
                }, {
                    new: true
                }, function (err, org) {
                    if (err) next(err);
                    res.json(org);
                });
            }
            else {
            console.log('The organization contain aready the entity.');
            res.statusCode = 500;
            res.statusMessage = 'The organization :  + orgId &  contains aready the entity id :  + entId';
            res.end('The organization : '  + orgId +  'contains aready the entity id : ' + entId);
            console.log('The organization : ' + orgId + ' contains aready the entity id : ' + entId);
            }
        }
        else {
            res.statusCode = 500;
            res.statusMessage = 'Cannot update the organization with new entity because either organization does not exist, entity id  was not provided or organization object is not setup to hold a collection of entities';
            console.log('Cannot update the organization with new entity because either organization does not exist, entity id  was not provided or organization object is not setup to hold a collection of entities');
            next();
         }
    });
    //} catch  {
    //  console.log('Error while adding an entity to the organization: ' + orgId);
    //}
    //res.json({});


})
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    //try {
    var orgId = req.params.orgId;
    var entId = req.params.entId;
    var updatedOrg = {};
    console.log('delete has been invoked to remove entity id' + entId + 'from organization id: ' + req.params.orgId);
    Orgs.findById(orgId, function (err, org) {
        if (err) next(err);
        console.log('[delete entity from org] - no error after while retrieving org from db');
        //get the array and add the new entity ID to the entities
        if (org && org.entities && Array.isArray(org.entities)) {
            console.log('proceeding to remove entities from org');
            // if the entity does not exist in the orgamization, add id
            var entIndex = org.entities.indexOf(entId);
            if (entIndex !== -1) {
                console.log('Entity '+ entId + ' exists in the array. ' + org.entities);
                org.entities.splice(entIndex,1);
                updatedOrg = org;
                console.log('Entity  with  the entity id : ' + entId + ' has been removed from  Organization : ' + orgId );
                console.log('Removed entity frm the entity array. ' + updatedOrg.entities);
                console.log('Updating the database with the organization : ' + orgId + ' after removing  entity id : ' + entId);
                console.log('The  entities are : ' + updatedOrg._id + ' entities: ' + updatedOrg.entities);
                Orgs.findByIdAndUpdate(orgId, {
                    $set: updatedOrg
                }, {
                    new: true
                }, function (err, org) {
                    if (err) next(err);
                    res.json(org);
                });
            }
            else {
                console.log('The organization does nor containentity.');
                res.statusCode = 500;
                res.statusMessage = 'The organization : '  + orgId + ' doe not contains the entity id : '   + entId;
                res.end = 'The organization : ' + orgId + ' doe not contains the entity id : ' + entId;
            }
        }
        else {
            res.statusCode = 500;
            res.statusMessage = 'Cannot remove entity from the organization  because either organization does not exist, entity id  was not provided or organization object is not setup to hold a collection of entities';
            console.log('Cannot remove entity from the organization  because either organization does not exist, entity id  was not provided or organization object is not setup to hold a collection of entities');
            next();
        }
    });
    //} catch  {
    //  console.log('Error while adding an entity to the organization: ' + orgId);
    //}
    //res.json({});

}
);



module.exports = orgRouter;