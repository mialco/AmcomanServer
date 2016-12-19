var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Users = require('../models/user');

var adminRouter = express.Router();
adminRouter.use(bodyParser.json());

adminRouter.route('/')
.get(function (req, res, next) {
    res.end('admin request');
    //Users.find({}, function (err, leader) {
    //    if (err) throw err;
    //    res.json(leader);
    //});
})

.post(function (req, res, next) {
    Leaders.create(req.body, function (err, leader) {
        if (err) throw err;
        console.log('Leader created!');
        var id = leader._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the leader with id: ' + id);
    });
})

.delete(function (req, res, next) {
    Leaders.remove({}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

adminRouter.route('/users')
.get(function (req, res, next) {
    res.end('admin/Users answer');
});



adminRouter.route('/:userId')
.get(function (req, res, next) {
    Users.findById(req.params.leaderId, function (err, leader) {
        if (err) throw err;
        res.json(leader);
    });
})

.put(function (req, res, next) {
    Leaders.findByIdAndUpdate(req.params.leaderId, {
        $set: req.body
    }, {
        new: true
    }, function (err, leader) {
        if (err) throw err;
        res.json(leader);
    });
})

.delete(function (req, res, next) {
    Leaders.findByIdAndRemove(req.params.leaderId, function (err, resp) {        if (err) throw err;
        res.json(resp);
    });
});


module.exports = adminRouter;