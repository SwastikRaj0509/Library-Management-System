import Book from "../models/Book.js";



// ADD BOOK
export const addBook = async (req, res) => {

   try {

      const {
         title,
         author,
         category,
         isbn,
         publisher,
         quantity,
         description,
         image
      } = req.body;

      const bookExists = await Book.findOne({ isbn });

      if(bookExists){

         return res.status(400).json({
            message: "Book already exists"
         });
      }

      const book = await Book.create({

         title,
         author,
         category,
         isbn,
         publisher,
         quantity,
         availableCopies: quantity,
         description,
         image
      });

      res.status(201).json(book);

   } catch(error){

      res.status(500).json({
         message: error.message
      });
   }
};

// GET ALL BOOKS
export const getBooks = async (req, res) => {

   try {

      const books = await Book.find();

      res.json(books);

   } catch(error){

      res.status(500).json({
         message: error.message
      });
   }
};

//Get Single Book
export const getBookById = async (req, res) => {

   try {

      const book = await Book.findById(req.params.id);

      if(book){
         res.json(book);
      } else {
         res.status(404).json({
            message: "Book not found"
         });
      }

   } catch(error){

      res.status(500).json({
         message: error.message
      });
   }
};

//Update Book
export const updateBook = async (req, res) => {

   try {

      const book = await Book.findById(req.params.id);

      const bookExists = await Book.findOne({
         isbn: req.body.isbn,
         _id: { $ne: req.params.id }
      });

      if(bookExists){

         return res.status(400).json({
            message: "Book already exists"
         });
      }

      if(book){

         book.title = req.body.title || book.title;

         book.author = req.body.author || book.author;

         book.category = req.body.category || book.category;

         book.isbn = req.body.isbn || book.isbn;

         book.publisher =
            req.body.publisher || book.publisher;

         book.quantity =
            req.body.quantity || book.quantity;

         book.availableCopies =
            req.body.availableCopies ||
            book.availableCopies;

         book.description =
            req.body.description ||
            book.description;

         const updatedBook = await book.save();

         res.json(updatedBook);

      } else {

         res.status(404).json({
            message: "Book not found"
         });
      }

   } catch(error){

      res.status(500).json({
         message: error.message
      });
   }
};

//Delete Book
export const deleteBook = async (req, res) => {

   try {

      const book = await Book.findById(req.params.id);

      if(book){

         await book.deleteOne();

         res.json({
            message: "Book removed"
         });

      } else {

         res.status(404).json({
            message: "Book not found"
         });
      }

   } catch(error){

      res.status(500).json({
         message: error.message
      });
   }
};

// SEARCH BOOKS
export const searchBooks = async (req, res) => {

   try {

      const keyword = req.query.keyword;

      const books = await Book.find({
         $or: [
            { title: { $regex: keyword, $options: "i" } },
            { author: { $regex: keyword, $options: "i" } },
            { category: { $regex: keyword, $options: "i" } }
         ]
      });

      res.json(books);

   } catch(error){

      res.status(500).json({
         message: error.message
      });
   }
};