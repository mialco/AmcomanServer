var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var Entities = new Schema({
    name: { type: String, required: true ,unique: true},
    url: {type: String, required: true, unique: true} ,
    description: {type: String, required: true} ,
});


Entities.plugin(passportLocalMongoose);

module.exports = mongoose.model('Entities', Entities);
