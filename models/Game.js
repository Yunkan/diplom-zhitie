const { Schema, model } = require('mongoose');

const schema = new Schema({
	userAmount: { type: Number },
	gameType: { type: String },
	creater: { type: String }
});

module.exports = model('Game', schema);