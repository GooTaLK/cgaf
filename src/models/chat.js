const { Schema, model } = require('mongoose');

const ChatSchema = new Schema({
	nickname: String,
	message: String,
	created_at: {
		type: Date,
		default: Date.now,
	},
});

module.exports = model('Chat', ChatSchema);
