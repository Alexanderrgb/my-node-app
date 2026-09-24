
const express = require('express');
const app = express();
const PORT = 3001; 


app.use(express.json());


let books = [
    { id: 1, title: "Война и мир", author: "Толстой", year: 1869 },
    { id: 2, title: "Анна Каренина", author: "Толстой", year: 1877 },
    { id: 3, title: "Преступление и наказание", author: "Достоевский", year: 1866 },
    { id: 4, title: "Идиот", author: "Достоевский", year: 1869 }
];


let nextId = 21;

app.get('/api/books', (req, res) => {
    res.json(books); 
});


app.get('/api/books/search', (req, res) => {
    const author = req.query.author; 

    if (!author) {
        return res.status(400).json({ error: "Укажите параметр author" });
    }

    const found = books.filter(book =>
        book.author.toLowerCase() === author.toLowerCase()
    );

    if (found.length === 0) {
        return res.status(404).json({ error: "Книги этого автора не найдены" });
    }

    res.json(found);
});

app.get('/api/books/:id', (req, res) => {
    const id = parseInt(req.params.id); 
    const book = books.find(b => b.id === id); 

    if (!book) {
        return res.status(404).json({ error: "Книга не найдена" });
    }

    res.json(book);
});

app.post('/api/books', (req, res) => {
    const { title, author, year } = req.body; 


    if (!title || !author || !year) {
        return res.status(400).json({ error: "Нужно заполнить title, author и year" });
    }

   
    const newBook = {
        id: nextId++,
        title,
        author,
        year
    };

    books.push(newBook); 
    res.status(201).json(newBook);
});

app.put('/api/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const bookIndex = books.findIndex(b => b.id === id); 

    if (bookIndex === -1) {
        return res.status(404).json({ error: "Книга не найдена" });
    }

    const { title, author, year } = req.body;

    if (title) books[bookIndex].title = title;
    if (author) books[bookIndex].author = author;
    if (year) books[bookIndex].year = year;

    res.json(books[bookIndex]);
});

app.delete('/api/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const bookIndex = books.findIndex(b => b.id === id);

    if (bookIndex === -1) {
        return res.status(404).json({ error: "Книга не найдена" });
    }

    books.splice(bookIndex, 1); 
    res.json({ message: "Книга успешно удалена" });
});

app.listen(PORT, () => {
    console.log(` Сервер API запущен на порту ${PORT}`);
    console.log(` Тест в браузере: http://localhost:${PORT}/api/books`);
});