import express from "express";
import { createBooking, checkAvailability, getMyBookings, getAllBookings, getBookingById, cancelBooking, updateBookingStatus  } from "../controller/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";
import { optionalAuth } from "../middleware/optionalAuth.js";
import { adminOnly } from "../middleware/adminMiddleware.js";


const router = express.Router();

router.post("/", optionalAuth, createBooking);
router.get("/my-bookings", protect, getMyBookings);
router.get("/admin", protect, adminOnly, getAllBookings)
router.put("/:id/status", protect, adminOnly, updateBookingStatus);
router.get("/:id", protect, getBookingById);
router.delete("/:id", protect, cancelBooking);
router.post("/check-availability", checkAvailability);


export default router;