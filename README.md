# test-flow back-end (API) for test-flow-client repository
Simple CRUD for book model with Mongoose

## install dependencies
npm install<br>
npm install --global mocha

## serve at localhost:8000
npm start

## run tests
npm test

# provaded API
## get all books
GET http://localhost:8000/books
## create book
POST http://localhost:8000/books
## find a book by id
GET http://localhost:8000/books/:id
## edit a book by id
PUT http://localhost:8000/books/:id
## delete a book by id
DELETE http://localhost:8000/books/:id