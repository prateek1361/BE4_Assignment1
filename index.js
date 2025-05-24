const express = require("express");
const mongoose = require("mongoose");
const Book = require("./books.js");
const { initializeDatabase } = require("./db/db.connect");

const app = express();
app.use(express.json());

initializeDatabase()

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

async function createBook(data){
    try{
        const book = new Book(data)
        const saveBook = await book.save()
        return saveBook
    } catch(error){
       throw error
    }
}

app.post("/books", async (req, res) => {
    try{
        const savedBook = await createBook(req.body)
        res.status(201).json({message: "Book added succesfully", book: savedBook})
    } catch(error){
        res.status(500).json({error: "Failed to add book."})
    }
})

async function getAllBooks(){
    try{
        const allBooks = await Book.find()
        return allBooks
    } catch(error){
        console.log(error)
    }
}

app.get("/books", async (req, res) => {
    try{
        const books = await getAllBooks()
        if(books.length != 0){
            res.json(books)
        } else {
            res.status(404).json({error: "No books found."})
        }
    } catch(error){
        res.status(500).json({error: "Failed to fetch books."})
    }
})

app.get("/books/:title", async (req, res) => {
    const { title } = req.params;
    try {
        const book = await readBookByTitle(title);
        if (book) {
            res.json(book);
        } else {
            res.status(404).json({ error: "Book not found." });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch book." });
    }
});

async function readBookByTitle(title) {
    try {
        return await Book.findOne({ title });
    } catch (error) {
        console.log(error);
        throw error;
    }
}

app.get("/books/author/:authorName", async (req, res) => {
    const { authorName } = req.params;
    try {
        const books = await readBooksByAuthor(authorName);
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch books." });
    }
});

async function readBooksByAuthor(author) {
    try {
        return await Book.find({ author });
    } catch (error) {
        console.log(error);
        throw error;
    }
}

app.get("/books/genre/business", async (req, res) => {
    try {
        const books = await readBooksByGenre("Business");
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch books." });
    }
});

async function readBooksByGenre(genre) {
    try {
        return await Book.find({ genres: genre });
    } catch (error) {
        console.log(error);
        throw error;
    }
}

app.get("/books/year/2012", async (req, res) => {
    try {
        const books = await readBooksByYear(2012);
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch books." });
    }
});

async function readBooksByYear(year) {
    try {
        return await Book.find({ publishedYear: year });
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function updateBookRating(bookId, ratingToUpdate) {
    try {
        const updatedBook = await Book.findByIdAndUpdate(
            bookId,
            ratingToUpdate,
            { new: true }
        );
        return updatedBook;
    } catch (error) {
        console.log("Error in updating book rating.", error);
        throw error;
    }
}

app.post("/books/:bookId", async (req, res) => {
    try {
        const updatedBook = await updateBookRating(req.params.bookId, req.body);
        if (updatedBook) {
            res.status(200).json({
                message: "Book rating updated successfully.",
                updatedBook: updatedBook,
            });
        } else {
            res.status(404).json({ error: "Book does not exist." });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to update book rating." });
    }
});

async function updateByTitle(bookTitle, dataToUpdate){
  try{
    const updatedBook = await Book.findOneAndUpdate({title: bookTitle}, dataToUpdate, {new: true})
    return updatedBook
  } catch(error){
    console.log("Error in updating Book rating.", error)
  }
}

app.post("/books/title/:title", async (req, res) => {
      try{
        const updatedBook = await updateByTitle(req.params.title, req.body)
        if(updatedBook){
            res.status(200).json({message: "Book updated successfully.", updatedBook: updatedBook})
        } else {
            res.status(404).json({error: "Book not found."})
        }
    } catch(error){
        res.status(500).json({error: "Failed to update Book."})
    }
})

async function deleteBook(bookId){
    try{
        const deletedBook = await Book.findByIdAndDelete(bookId)
        return deletedBook
    } catch(error){
        console.log(error)
    }
}

app.delete("/books/:bookId", async (req, res) => {
    try{
        const deletedBook = await deleteBook(req.params.bookId)
        if(deletedBook){
            res.status(200).json({message: "Book deleted successfully."})
        }
    } catch(error){
        res.status(500).json({error: "Failed to delete Book."})
    }
})

    

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})

