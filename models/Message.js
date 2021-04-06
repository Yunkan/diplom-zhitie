const { Schema, model } = require('mongoose');

const schema = new Schema({
	username: { type: String },
	text: { type: String },
	date: { type: String },
	userId: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = model('Message', schema);