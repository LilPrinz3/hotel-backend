import express from "express";
import { registerUser, loginUser } from "../controller/authController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { getMyBookings, getAllBookings } from "../controller/bookingController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
// router.get("/user", getUser);
router.get("/my-bookings", protect, getMyBookings);
router.get("/all-bookings", protect, authorizeRoles("admin"), getAllBookings);

export default router;