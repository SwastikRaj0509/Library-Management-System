import express from "express";

import {
   registerUser,
   loginUser,
   forgotPassword,
   resetPassword,
   verifyResetToken,
   resetPasswordDirect
} from "../controllers/authController.js";

import {
   protect
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

router.post("/reset-password-direct", resetPasswordDirect);

router.get("/verify-token/:token", verifyResetToken);

router.get("/profile", protect, (req, res) => {
   res.json(req.user);
});

export default router;