const { Schema, model } = require('mongoose');

const schema = new Schema({
	email: { type: String, required: true, unique: true },
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	health: { type: Number },
	starve: { type: Number },
	stamina: { type: Number },
	money: { type: Number },
	role: { type: String },
	rating: { type: Number }
});

module.exports = model('User', schema);