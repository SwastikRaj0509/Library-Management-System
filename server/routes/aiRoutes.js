import express from "express";

import {
   aiChat
} from "../controllers/aiController.js";

import {
   protect
} from "../middlewares/authMiddleware.js";

const router = express.Router();


// AI CHAT ROUTE
router.post(
   "/chat",
   protect,
   aiChat
);

export default router;