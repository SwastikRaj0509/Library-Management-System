import Borrow from "../models/Borrow.js";
import Book from "../models/Book.js";


//Borrow Book 
export const borrowBook = async (req, res) => {

   try {

      const { bookId } = req.body;

      const book = await Book.findById(bookId);

      if(!book){

         return res.status(404).json({
            message: "Book not found"
         });
      }

      if(book.availableCopies < 1){

         return res.status(400).json({
            message: "No copies available"
         });
      }

      // DUE DATE = 7 DAYS
      const dueDate = new Date();

      dueDate.setDate(dueDate.getDate() + 7);


      const borrow = await Borrow.create({

         user: req.user._id,

         book: bookId,

         dueDate
      });

      // REDUCE AVAILABLE COPIES
      book.availableCopies -= 1;

      await book.save();

      res.status(201).json(borrow);

   } catch(error){

      res.status(500).json({
         message: error.message
      });
   }
};

//return book
export const returnBook = async (req, res) => {

   try {

      const borrow = await Borrow.findById(req.params.id);

      if(!borrow){

         return res.status(404).json({
            message: "Borrow record not found"
         });
      }

      if(borrow.status === "returned"){

         return res.status(400).json({
            message: "Book already returned"
         });
      }

      borrow.status = "returned";

      borrow.returnDate = Date.now();
      
      // CHECK OVERDUE
const today = new Date();

   if(today > borrow.dueDate){

   const lateDays = Math.ceil(
      (today - borrow.dueDate) / (1000 * 60 * 60 * 24)
   );

   borrow.isOverdue = true;

   borrow.fine = lateDays * 10;
   }
      await borrow.save();


      // INCREASE AVAILABLE COPIES
      const book = await Book.findById(borrow.book);

      book.availableCopies += 1;

      await book.save();

      res.json({
         message: "Book returned successfully"
      });

   } catch(error){

      res.status(500).json({
         message: error.message
      });
   }
};

//Get Logged-in User Borrow History
export const getMyBorrowedBooks = async (req, res) => {

   try {

      const borrows = await Borrow.find({ user: req.user._id })
   .populate("user", "name email")
   .populate("book", "title author");

      res.json(borrows);

   } catch(error){

      res.status(500).json({
         message: error.message
      });
   }
};

//Get All Borrow Records (Admin/Librarian)
export const getAllBorrowRecords = async (req, res) => {

   try {

      const borrows = await Borrow.find()
         .populate("user", "name email")
         .populate("book", "title author");

      res.json(borrows);

   } catch(error){

      res.status(500).json({
         message: error.message
      });
   }
};

