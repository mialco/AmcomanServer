var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var Organizations = new Schema({
    organizationName: { type: String, required: true },
    contactName: String,
    contactEmail: String,
    contactPhone :String
});


Organizations.plugin(passportLocalMongoose);

module.exports = mongoose.model('Organizations', Organizations);
