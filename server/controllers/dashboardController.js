import Book from "../models/Book.js";
import User from "../models/user.js";
import Borrow from "../models/Borrow.js";


// GET DASHBOARD STATS
export const getDashboardStats = async (req, res) => {

   try {

      const totalBooks = await Book.countDocuments();

      const totalUsers = await User.countDocuments();

      const borrowedBooks = await Borrow.countDocuments({
         status: "borrowed"
      });

      const overdueBooks = await Borrow.countDocuments({
         isOverdue: true
      });

      res.json({
         totalBooks,
         totalUsers,
         borrowedBooks,
         overdueBooks
      });

   } catch(error){

      res.status(500).json({
         message: error.message
      });
   }
};