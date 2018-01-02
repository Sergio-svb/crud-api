const chai = require('chai');
const chaiHttp = require('chai-http');
let Book = require('../app/models/book');
const server = require('../server');
const should = require('should');
let sinon = require('sinon');
let summary = require('../app/services/bookInfoCreater');

chai.use(chaiHttp);
describe('Book info creator', () => {
    let summaryStub;
    before(function () {
        summaryStub = {
            non_object: null,
            invalid: {title: 'Some title.'},
            valid: {_id: 'wygfyg36333ftutueggg', title: "The Chronicles of Narnia", author: "C.S. Lewis", year: 1948, pages: 778}
        };
    });

    afterEach(function (){
        summary.createSammary.restore();
    });

    describe('validate book', () => {
        /*
         * Test summary.createSammary by passing null
         */
        it('it should pass null to summary creator', (done) => {
            let spy = sinon.spy(summary, 'createSammary');

            try {
                summary.createSammary(summaryStub.non_object);
            } catch (e) {
                spy.exceptions[0].should.be.instanceof(TypeError);
                spy.exceptions[0].should.have.property('message', 'Cannot convert undefined or null to object');
            }

            done();
        });

        /*
         * Test summary.createSammary by passing invalid book
         */
        it('it should pass invalid book to summary creator', (done) => {
            let spy = sinon.spy(summary, 'createSammary');

            try {
                summary.createSammary(summaryStub.invalid);
            } catch (e) {
                spy.exceptions[0].should.be.instanceof(TypeError);
                spy.exceptions[0].should.have.property('message', 'The properties of the book are not valid.');
            }

            done();
        });

        /*
         * Test summary.createSammary by passing valid book
         */
        it('it should pass valid book to summary creator', (done) => {
            let spy = sinon.spy(summary, 'createSammary');
            let result = summary.createSammary(summaryStub.valid);

            result.should.be.Object();
            result.should.have.property('book');
            result.book.should.have.property('title');
            result.book.should.have.property('author');
            result.book.should.have.property('pages');
            result.book.should.have.property('year');
            spy.callCount.should.be.equal(1);

            done();
        });
    });
});
/**
 * Main block
 */
describe('Books', () => {
    /**
     * Before each iteration, we clear the database
     */
    beforeEach((done) => {
        Book.remove({}, (err) => {
            done();
        });
    });

    /*
     * Test getting all books from /books route
     */
    describe('/GET book', () => {
        it('it should GET empty books array', (done) => {
            chai.request(server)
                .get('/books')
                .end((err, res) => {
                    res.should.have.property('status', 200);
                    res.body.should.be.Array();
                    res.body.length.should.be.equal(0);
                    done();
                });
        });
    });

    /**
     * Test creating a book
     */
    describe('/POST book', () => {
        /**
         * Create a book without pages field
         */
        it('it should not POST a book without pages field', (done) => {
            let book = {
                title: "The Lord of the Rings",
                author: "J.R.R. Tolkien",
                year: 1954
            };

            chai.request(server)
                .post('/books')
                .send(book)
                .end((err, res) => {
                    res.should.have.property('status', 406);
                    res.body.should.be.Object();
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('pages');
                    res.body.errors.pages.should.have.property('kind').be.equal('required');
                    done();
                });
        });

        /**
         * Test a book with correct object
         */
        it('it should POST a book ', (done) => {
            let book = {
                title: "The Lord of the Rings",
                author: "J.R.R. Tolkien",
                year: 1954,
                pages: 1170
            };

            chai.request(server)
                .post('/books')
                .send(book)
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .end((err, res) => {
                    res.should.have.property('status', 200);
                    res.body.should.be.Object();
                    res.body.should.have.property('message').be.equal('Book successfully added!');
                    res.body.book.should.have.property('title');
                    res.body.book.should.have.property('author');
                    res.body.book.should.have.property('pages');
                    res.body.book.should.have.property('year');
                    res.body.book.should.have.property('createdAt');
                    done();
                });
        });
    });

    /**
     * Create a book and get it by _id
     */
    describe('/GET/:id book', () => {
        it('it should GET a book by the given id', (done) => {
            let book = new Book({ title: "The Lord of the Rings", author: "J.R.R. Tolkien", year: 1954, pages: 1170 });
            book.save((err, book) => {
                chai.request(server)
                    .get('/books/' + book.id)
                    .send(book)
                    .end((err, res) => {
                        res.should.have.property('status', 200);
                        res.body.should.be.Object();
                        res.body.should.have.property('title');
                        res.body.should.have.property('author');
                        res.body.should.have.property('pages');
                        res.body.should.have.property('year');
                        res.body.should.have.property('createdAt');
                        res.body.should.have.property('_id').be.equal(book.id);
                        done();
                    });
            });

        });
    });

    /**
     * Create a book and update it by _id
     */
    describe('/PUT/:id book', () => {
        it('it should UPDATE a book given the id', (done) => {
            let book = new Book({title: "The Chronicles of Narnia", author: "C.S. Lewis", year: 1948, pages: 778});
            book.save((err, book) => {
                chai.request(server)
                    .put(`/books/${book.id}`)
                    .send({title: "The Chronicles of Narnia", author: "C.S. Lewis", year: 1950, pages: 778})
                    .set('Content-Type', 'application/x-www-form-urlencoded')
                    .then(res => {
                        res.should.have.property('status', 200);
                        res.body.should.be.Object();
                        res.body.should.have.property('message').be.equal('Book updated!');
                        res.body.book.should.have.property('year').be.equal(1950);
                        done();
                    });
            });
        });
    });

    /**
     * Create a book and delete it by _id
     */
    describe('/DELETE/:id book', () => {
        it('it should DELETE a book by the wrong id', (done) => {
            let fakeId = `fake1111`;
            chai.request(server).delete(`/books/${fakeId}`).catch(res => {
                res.should.have.property('status', 404);
                done();
            });
        });

        it('it should DELETE a book by the id', (done) => {
            let book = new Book({title: "The Chronicles of Narnia", author: "C.S. Lewis", year: 1948, pages: 778});
            book.save().then(book => {
                chai.request(server).delete(`/books/${book.id}`).then(res => {
                    res.should.have.property('status', 200);
                    res.body.should.be.Object();
                    res.body.should.have.property('message').be.equal('Book successfully deleted!');
                    res.body.result.should.have.property('ok').be.equal(1);
                    res.body.result.should.have.property('n').be.equal(1);
                    done();
                });
            });
        });
    });
});