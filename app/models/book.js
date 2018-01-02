let mongoose = require('mongoose');
let Schema = mongoose.Schema;

/**
 * Book schema definition
 * @type {mongoose.Schema}
 */
let BookSchema = new Schema(
	{
		title: {type: String, required: true},
		author: {type: String, required: true},
		year: {type: Number, required: true},
		pages: {type: Number, required: true, min: 1},
		createdAt: {type: Date, default: Date.now},
	},
	{
		versionKey: false
	}
);

/**
 * Set the createdAt parameter to the current time
 */
BookSchema.pre('save', next => {
	now = new Date();
	if (!this.createdAt) {
		this.createdAt = now;
	}
	next();
});

/**
 * Export the model for later use.
 */
module.exports = mongoose.model('book', BookSchema);