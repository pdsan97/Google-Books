export const Book = ({
	link,
	title,
	subtitle,
	cover,
	description,
	authors,
	deleteBook,
	saveBook,
	saved,
	canDelete,
}) => {
	return (
		<div className="container border border-dark my-2 p-4 d-flex flex-column">
			<div className="d-flex">
				<div className="d-flex flex-column">
					<p className="fs-4">{title}</p>
					{subtitle && <p className="fs-5">{subtitle}</p>}
					<p className="fs-6">
						Written by {authors && authors.join(', ')}
					</p>
				</div>
				<div className="d-flex flex-row justify-content-end flex-grow-1 align-items-start">
					<a
						href={link}
						className="btn btn-primary mx-1"
						target="_blank"
						rel="noreferrer"
					>
						View
					</a>
					{canDelete ? (
						<button
							className="btn btn-danger mx-1"
							onClick={deleteBook}
						>
							Delete
						</button>
					) : (
						<button
							className="btn btn-secondary mx-1"
							onClick={saveBook}
							disabled={saved}
						>
							{saved ? 'Saved' : 'Save'}
						</button>
					)}
				</div>
			</div>
			<div className="d-flex flex-wrap flex-md-nowrap">
				<img
					src={cover}
					className="img rounded float-md-left mx-auto mx-md-0 my-4 my-md-0"
					alt="book-cover"
				/>
				<p className="fs-5 mx-4 ">{description}</p>
			</div>
		</div>
	);
};
