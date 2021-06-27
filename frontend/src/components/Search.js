import { useEffect, useState } from 'react';
import { socket } from '../socket';
import { Book } from './Book';

export const Search = () => {
	const [books, setBooks] = useState([]);
	const [savedBooks, setSavedBooks] = useState([]);
	const [isSearching, setIsSearching] = useState(false);

	const handleSubmit = async ev => {
		const [bookName] = ev.target.elements;
		ev.preventDefault();
		if (bookName.value) {
			setIsSearching(true);
			const response = await fetch(
				`https://www.googleapis.com/books/v1/volumes?q=${bookName.value
					.toLowerCase()
					.split(' ')
					.join('+')}`
			);
			bookName.value = '';
			const data = await response.json();
			const books = data.items.map(item => item.volumeInfo);
			setBooks(books);
			setIsSearching(false);
		}
	};

	const getBooks = async () => {
		const response = await fetch('/api/books');
		const data = await response.json();
		setSavedBooks(data);
	};

	const handleSave = async book => {
		const newBook = {
			title: book.title,
			subtitle: book.subtitle,
			description: book.description,
			cover: book.imageLinks.thumbnail,
			authors: book.authors,
			link: book.infoLink,
		};
		setSavedBooks(prev => [...prev, newBook]);
		await fetch('api/books', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify(newBook),
		})
			.then(res => res.json())
			.then(b => socket.emit('save-book', b));
	};

	const isSaved = book => {
		const found = savedBooks.find(p => p.title === book.title);
		return !!found;
	};

	useEffect(() => {
		getBooks();
	}, []);

	return (
		<>
			<div className="container border border-dark my-5 p-4">
				<p className="fs-1 text-center fw-bold">Google Books Search</p>
				<p className="fs-2 text-center">
					Search for and Save Books Interest
				</p>
			</div>
			<div className="container border border-dark my-5 p-4">
				<p className="fs-4">Book Search</p>
				<p className="fs-6">Book</p>
				<form onSubmit={handleSubmit}>
					<div className="mb-3">
						<input
							type="text"
							className="form-control"
							id="search"
						/>
					</div>
					<button
						type="submit"
						className="btn btn-primary"
						disabled={isSearching}
					>
						Submit
					</button>
				</form>
			</div>
			{books.length > 0 && (
				<div className="container border border-dark my-5 p-0 p-md-4">
					<p className="fs-4">Results</p>
					{books.map((book, i) => (
						<Book
							link={book.infoLink}
							title={book.title}
							subtitle={book.subtitle}
							authors={book.authors}
							cover={book.imageLinks.thumbnail}
							description={book.description}
							key={i}
							saved={isSaved(book)}
							canDelete={false}
							saveBook={() => handleSave(book)}
						></Book>
					))}
				</div>
			)}
		</>
	);
};
