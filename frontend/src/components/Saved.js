import { useEffect, useState } from 'react';
import { Book } from './Book';
import { socket } from '../socket';

export const Saved = () => {
	const [books, setBooks] = useState([]);
	const fetchSavedBooks = async () => {
		const response = await fetch('/api/books');
		const data = await response.json();
		setBooks(data);
	};
	useEffect(() => {
		socket.on('save-book', book => {
			setBooks(prev => [...prev, book]);
		});
		socket.on('delete-book', books => {
			setBooks(prev => prev.filter(b => b._id !== books[0]._id));
		});
		fetchSavedBooks();
	}, []);

	const handleDelete = async id => {
		const book = books.filter(book => book._id === id);
		setBooks(prev => prev.filter(book => book._id !== id));
		socket.emit('delete-book', book);
		await fetch(`api/books/${id}`, {
			method: 'DELETE',
		});
	};

	const orderedBooks = [...books].reverse();

	return (
		<div className="container border border-dark my-5 p-0 p-md-4">
			<p className="fs-4">Saved Books</p>
			{orderedBooks.length ? (
				orderedBooks.map(book => (
					<Book
						link={book.link}
						title={book.title}
						subtitle={book.subtitle}
						authors={book.authors}
						cover={book.cover}
						description={book.description}
						key={book.title}
						canDelete={true}
						deleteBook={() => handleDelete(book._id)}
					></Book>
				))
			) : (
				<p className="fs-5">No Saved Books</p>
			)}
		</div>
	);
};
