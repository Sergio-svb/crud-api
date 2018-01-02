const fs = require('fs');

class Summary {
	constructor(book) {
		if (Summary.validateBook(book)) {
			this.book = book;
		}
	}

	static validateBook(book) {
		let keys = ['_id', 'title', 'author', 'year', 'pages'];

		if (typeof book !== 'object') {
			throw new TypeError('The book is not an object.');
		}

		if (Object.keys(book).toString() !== keys.toString()) {
			throw new TypeError('The properties of the book are not valid.');
		}

		return true;
	}

	static createSammary(book) {
		return new Summary(book);
	}

	writeToFile() {
		return new Promise((resolve, reject) => {
			fs.writeFile(
				`./source/${this.book._id}.txt`,
				`${this.book.title}\nAuthor: ${this.book.author}.\nYear: ${this.book.year}.\nPages: ${this.book.pages}.`,
				(err) => {
					if (err) {
						reject(err);
					} else {
						resolve(`The file ${this.filePath} was succesfully saved!`);
					}
				});
		});
	}
}


module.exports = Summary;