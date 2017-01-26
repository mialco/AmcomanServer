// JavaScript source code
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Publinks = new Schema({
    name: { type: String },
    link: { type: String, required: true },
    images: [{
        img: {
            data: Buffer,
            imgLink: String,
            contentType: String,
            description: String,
            title: String,
            alt: String
        }
    }],
    description: String,
    longDescription: String,
    publisherRefNo: String,
    publisherRef: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Organizations' }],
    isActive: Boolean,
    startDate: Date,
    endDate: Date
});


module.exports = mongoose.model('Publinks', Publinks);
