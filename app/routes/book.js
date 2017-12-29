let Book = require('../models/book');
const express = require('express');
const router = express.Router();

/**
 * Middleware that is specific to this router.
 */
router.use(function timeLog(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // console.log('Time: ', Date.now());
    next();
});

/**
 * Getting all the route books.
 * @description Make a request to the database and, if not errors, give the entire list of books to the client.
 */
router.get('/', (req, res) => {
    Book.find().exec().then(books => res.json(books), err => res.status(400).send(err));
});

/**
 * To create a book on the route
 * @description Create a new book and save it to the database. If not errors send response with a book to the client.
 */
router.post('/', (req, res) => {
    let newBook = new Book(req.body);

    newBook.save().then(
        book => res.json({message: "Book successfully added!", book}),
        err => res.status(406).send(err)
    );
});

/**
 * To find a book on the route
 * @description Find a book by _id in the database. If not errors send response with  a book to the client.
 */
router.get('/:id', (req, res) => {
    Book.findById(req.params.id).exec().then(book => res.json(book), err => res.status(404).send(err));
});

/**
 * To delete a book on the route
 * @description Find a book by _id in the database. If not errors delete it and send response
 * with 200 code to the client.
 */
router.delete('/:id', (req, res) => {
    Book.remove({_id : req.params.id}).exec().then(
        result => res.json({ message: "Book successfully deleted!", result }),
        err => res.status(404).send(err)
    );
});

/**
 * To edit a book on the route
 */
router.put('/:id', (req, res) => {
    Book.findByIdAndUpdate(req.params.id, req.body, {new: true}).exec().then(
        book => res.json({ message: 'Book updated!', book }),
        err => res.status(404).send(err)
    );
});

module.exports = router;