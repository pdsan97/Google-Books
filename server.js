require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('./models/book');
const express = require('express');
const path = require('path');
const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

const mongooseInit = async () => {
	//set connection string with process variables
	await mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	});
};

mongooseInit();

// real-time notifications

io.on('connection', socket => {
	socket.on('save-book', book => {
		socket.broadcast.emit('save-book', book);
	});
	socket.on('delete-book', book => {
		socket.broadcast.emit('delete-book', book);
	});
});

// * `/api/books` (get) - Should return all saved books as JSON.

// * `/api/books` (post) - Will be used to save a new book to the database.

// * `/api/books/:id` (delete) - Will be used to delete a book from the database by Mongo `_id`.

app.use(express.static(path.join(__dirname, 'frontend/build'))).use(
	express.json()
);

app.get('/api/books', async (req, res) => {
	try {
		const books = await Book.find();
		res.send(books);
	} catch (err) {
		console.log(err);
		res.sendStatus(400);
	}
});

app.post('/api/books', (req, res) => {
	const { title, subtitle, description, cover, authors, link } = req.body;
	try {
		const book = new Book({
			_id: new mongoose.Types.ObjectId(),
			title,
			subtitle,
			description,
			cover,
			authors,
			link,
		});
		book.save();
		res.status(201).send(book);
	} catch (err) {
		console.log(err);
		res.sendStatus(400);
	}
});

app.delete('/api/books/:id', async (req, res) => {
	const { id } = req.params;
	await Book.deleteOne({ _id: id });
});

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

httpServer.listen(process.env.PORT || 8080);
