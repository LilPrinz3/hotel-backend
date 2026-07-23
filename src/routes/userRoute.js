import express from "express"
import { protect } from "../middleware/authMiddleware.js"
import { adminOnly } from "../middleware/adminMiddleware.js"
import { getAllUsers, makeAdmin } from "../controller/userController.js"

const router = express.Router();

// ADMIN ROUTES
router.get("/", protect, adminOnly, getAllUsers);
router.put("/make-admin/:id", protect, adminOnly, makeAdmin);

export default router;