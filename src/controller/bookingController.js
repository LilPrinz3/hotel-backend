import Booking from "../models/Booking.js";
import { sendCancellationEmail } from "../utils/email.js";

export const checkAvailability = async (req, res) => {
  try {
    const {
      roomId,
      checkIn,
      checkOut,
      email
    } = req.body;


    const userBooking = await Booking.findOne({
      roomId,
      email,
      checkIn,
      checkOut,
      status: "confirmed"
    });


    if (userBooking) {
      return res.status(400).json({
        available: false,
        message: "You already booked this room for these dates."
      });
    }

    const existingBooking = await Booking.findOne({
      roomId,
      checkIn: { $lt: checkOut },
      checkOut: { $gt: checkIn },
      status: "confirmed",
    });


    if (existingBooking) {
      return res.status(400).json({
        available: false,
        message: "This room is already booked for the selected dates."
      });
    }

    res.json({
      available: true
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const createBooking = async (req, res) => {
  try {
    const {
      roomId,
      checkIn,
      checkOut,
    } = req.body;

    // CHECK FOR OVERLAPPING BOOKINGS
    const existingBooking = await Booking.findOne({
      roomId,
      checkIn: { $lt: checkOut },
      checkOut: { $gt: checkIn }
    });

    if (existingBooking) {
      return res.status(400).json
        ({ message: "Room is already booked for the selected dates." });
    }

    // CREATE BOOKING
    const bookingData = {
      ...req.body,
      userId: req.user?.userId || null,
    };

    const booking = new Booking(bookingData);
    await booking.save();

    res.status(201).json(booking);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      $or: [
        { userId: req.user.userId },
        { email: req.user.email }
      ]
    }).sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      total: bookings.length,
      bookings,
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    res.status(200).json(booking);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Make sure user owns booking
    if (
      !req.user ||
      (
        booking.userId?.toString() !== req.user.userId &&
        booking.email !== req.user.email
      )
    ) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    // Update booking status to cancelled
    booking.status = "cancelled";
    await booking.save();

    // Send cancellation email
    sendsendCancellationEmail(booking).catch((error) => {
      console.log("Cancellation email error:", error.message);
    });

    
    res.json({
      message: "Booking cancelled successfully, Email confirmation sent",
      booking,
    });
  } catch (error) {
    console.log("Cancellation error:", error.message);
    res.status(500).json({ message: error.message });
  }


};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json(
        {
          message: "Booking not found"
        })
    }

    booking.status = status;
    await booking.save();

    // Send email notification to user about status update
    if (status === "cancelled") {
      sendCancellationEmail(booking).catch((error) => {
        console.log("Cancellation email error:", error.message);
      });
    }
    
    res.json({
      message: "Booking status updated successfully", booking
    })

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};
