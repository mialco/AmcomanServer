var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var Articles = new Schema({
		name: { type: String, required: true, unique : true },
		link: { type: String, required: true , unique: true},
		description: String,
		longDescription: String,
		isActive : {type: Boolean, default : true}
		//mediaCollection : [{type: Schema.Types.ObjectId, ref: 'Media'} ]
	});


Articles.plugin(passportLocalMongoose);

module.exports = mongoose.model('Articles', Articles);
