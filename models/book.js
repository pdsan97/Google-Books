const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Book = new Schema({
	_id: mongoose.Schema.Types.ObjectId,
	title: String,
	subtitle: String,
	description: String,
	cover: String,
	authors: Array,
	link: String,
});

module.exports = mongoose.model('Book', Book);
