const { Schema, model } = require('mongoose');

const schema = new Schema({
	text: { type: String },
	health: { type: Number },
	starve: { type: Number },
	stamina: { type: Number },
	money: { type: Number },
	rating: { type: Number }
});

module.exports = model('Adventure', schema);