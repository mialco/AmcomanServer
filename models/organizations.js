var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Organizations = new Schema({
    organizationName: { type: String, required: true },
    contactName: String,
    contactEmail: String,
    contactPhone :String,
    isPublisher: String,
	entities : [{type: mongoose.Schema.Types.ObjectId, 
        ref: 'Entities' }]
});


module.exports = mongoose.model('Organizations', Organizations);
