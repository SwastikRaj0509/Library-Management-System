import jwt from "jsonwebtoken";
import User from "../models/user.js";



// PROTECT ROUTES
export const protect = async (req, res, next) => {

   let token;

   if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
   ) {

      try {

         token = req.headers.authorization.split(" ")[1];

         const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
         );

         req.user = await User.findById(decoded.id).select("-password");

         if (!req.user) {
            return res.status(401).json({
               message: "Not authorized, user no longer exists"
            });
         }

         return next();

      } catch(error){

         return res.status(401).json({
            message: "Not authorized, token failed"
         });
      }

   }

   if(!token){

      return res.status(401).json({
         message: "Not authorized, no token"
      });
   }
};

//Admin or Librarian Middleware
export const adminOrLibrarian = (req, res, next) => {

   if(
      req.user &&
      (
         req.user.role === "admin" ||
         req.user.role === "librarian"
      )
   ){

      next();

   } else {

      res.status(403).json({
         message: "Access denied"
      });
   }
};

// ADMIN ONLY
export const admin = (req, res, next) => {

   if(req.user && req.user.role === "admin"){

      next();

   } else {

      res.status(403).json({
         message: "Admin access only"
      });
   }
};




// LIBRARIAN ONLY
export const librarian = (req, res, next) => {

   if(req.user && req.user.role === "librarian"){

      next();

   } else {

      res.status(403).json({
         message: "Librarian access only"
      });
   }
};