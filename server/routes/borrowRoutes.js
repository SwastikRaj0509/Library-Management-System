import express from "express";

import {
   borrowBook,
   returnBook,
   getMyBorrowedBooks,
   getAllBorrowRecords
} from "../controllers/borrowController.js";

import {
   protect,
   adminOrLibrarian
} from "../middlewares/authMiddleware.js";

const router = express.Router();


// BORROW BOOK
router.post("/", protect, borrowBook);


// RETURN BOOK
router.put("/return/:id", protect, returnBook);


// MY BORROW HISTORY
router.get("/my-books", protect, getMyBorrowedBooks);


// ALL BORROW RECORDS (Admin/Librarian only)
router.get("/", protect, adminOrLibrarian, getAllBorrowRecords);


export default router;