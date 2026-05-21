import User from "../models/user.js";
import generateToken from "../utils/generateToken.js";
import crypto from "crypto";
import { sendResetEmail } from "../utils/sendEmail.js";

// REGISTER USER
export const registerUser = async (req, res) => {

   try {

      const { name, email, password } = req.body;

      // CHECK USER EXISTS
      const userExists = await User.findOne({ email });

      if(userExists){
         return res.status(400).json({
            message: "User already exists"
         });
      }

      // CREATE USER
      const user = await User.create({
         name,
         email,
         password
      });

      res.status(201).json({
         _id: user._id,
         name: user.name,
         email: user.email,
         role: user.role,
         token: generateToken(user._id)
      });

   } catch(error){
      res.status(500).json({
         message: error.message
      });
   }
};

// LOGIN USER
export const loginUser = async (req, res) => {

   try {

      const { email, password } = req.body;

      // FIND USER
      const user = await User.findOne({ email });

      // CHECK PASSWORD
      if(user && (await user.matchPassword(password))){

         res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
         });

      } else {

         res.status(401).json({
            message: "Invalid email or password"
         });
      }

   } catch(error){

      res.status(500).json({
         message: error.message
      });
   }
};

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {

   try {

      const { email } = req.body;

      // FIND USER
      const user = await User.findOne({ email });

      if(!user){
         return res.status(404).json({
            message: "User not found with this email"
         });
      }

      // GENERATE RESET TOKEN
      const resetToken = crypto.randomBytes(20).toString("hex");

      // SET RESET TOKEN AND EXPIRATION (1 hour)
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);

      await user.save();

      // SEND EMAIL
      await sendResetEmail(user.email, resetToken, user.name);

      res.json({
         message: "Password reset link sent to your email"
      });

   } catch(error){

      res.status(500).json({
         message: error.message
      });
   }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {

   try {

      const { token, password } = req.body;

      // FIND USER WITH VALID TOKEN
      const user = await User.findOne({
         resetPasswordToken: token,
         resetPasswordExpires: { $gt: new Date() }
      });

      if(!user){
         return res.status(400).json({
            message: "Invalid or expired reset token"
         });
      }

      // UPDATE PASSWORD
      user.password = password;
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;

      await user.save();

      res.json({
         message: "Password reset successfully"
      });

   } catch(error){

      res.status(500).json({
         message: error.message
      });
   }
};

// VERIFY RESET TOKEN
export const verifyResetToken = async (req, res) => {

   try {

      const { token } = req.params;

      // FIND USER WITH VALID TOKEN
      const user = await User.findOne({
         resetPasswordToken: token,
         resetPasswordExpires: { $gt: new Date() }
      });

      if(!user){
         return res.status(400).json({
            message: "Invalid or expired reset token"
         });
      }

      res.json({
         message: "Token is valid",
         valid: true
      });

   } catch(error){

      res.status(500).json({
         message: error.message
      });
   }
};

// DIRECT PASSWORD RESET (without email link)
export const resetPasswordDirect = async (req, res) => {

   try {

      const { email, password } = req.body;

      // VALIDATE INPUT
      if (!email || !password) {
         return res.status(400).json({
            message: "Email and password are required"
         });
      }

      if (password.length < 6) {
         return res.status(400).json({
            message: "Password must be at least 6 characters"
         });
      }

      // FIND USER
      const user = await User.findOne({ email });

      if (!user) {
         return res.status(404).json({
            message: "User not found with this email"
         });
      }

      // UPDATE PASSWORD
      user.password = password;
      await user.save();

      res.json({
         message: "Password reset successfully"
      });

   } catch(error){

      res.status(500).json({
         message: error.message
      });
   }
};