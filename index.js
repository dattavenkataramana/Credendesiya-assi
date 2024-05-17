
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3000;

mongoose.connect(process.env.DB)
    .then(() => console.log("Connected to MongoDB"))
    .catch(e => console.log(e.message));

const bookSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    img: { type: String, required: true },
    summary: { type: String, required: true }
});

const Book = mongoose.model("Book", bookSchema);

app.post('/books', async (req, res) => {
    const { name, img, summary } = req.body;
    
    try {
        const existingBook = await Book.findOne({ name });
        if (existingBook) {
            return res.status(400).json({ message: 'Book already exists' });
        }

        const newBook = await Book.create({ name, img, summary });
        res.status(201).json({ message: 'Book registered successfully', book: newBook });
    } catch (error) {
        res.status(400).json({ message: 'Failed to register book', error: error.message });
    }
});
 
app.get('/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).send(books);
    } catch (err) {
        res.status(500).send(err);
    }
});

 
app.get('/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).send();
        }
        res.status(200).send(book);
    } catch (err) {
        res.status(500).send(err);
    }
});


app.put('/books/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const updatedBook = await Book.findByIdAndUpdate(id, { name }, { new: true });
        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json({ message: 'Book updated successfully', book: updatedBook });
    } catch (error) {
        res.status(400).json({ message: 'Failed to update book', error: error.message });
    }
});


app.patch('/books/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const updatedBook = await Book.findByIdAndUpdate(id, { name }, { new: true });
        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json({ message: 'Book updated successfully', book: updatedBook });
    } catch (error) {
        res.status(400).json({ message: 'Failed to update book', error: error.message });
    }
});


 
app.delete('/books/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).send();
        }
        res.status(200).send(book);
    } catch (err) {
        res.status(500).send(err);
    }
});

 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

