import express from "express";

import {
   addBook,
   getBooks,
   getBookById,
   updateBook,
   deleteBook,
   searchBooks
} from "../controllers/bookController.js";

import {
   protect,
   adminOrLibrarian,
   admin
} from "../middlewares/authMiddleware.js";

const router = express.Router();


// ADD BOOK
router.post(
   "/",
   protect,
   adminOrLibrarian,
   addBook
);


// GET ALL BOOKS
router.get("/", getBooks);

//Search Books
router.get("/search", searchBooks);

// GET SINGLE BOOK
router.get("/:id", getBookById);


// UPDATE BOOK
router.put(
   "/:id",
   protect,
   adminOrLibrarian,
   updateBook
);

// DELETE BOOK
router.delete(
   "/:id",
   protect,
   admin,
   deleteBook
);

export default router;