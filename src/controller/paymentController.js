import axios from "axios";
import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import nodemailer from "nodemailer";

export const initiatePayment = async (req, res) => {
  //  console.log("initiatePayment hit"); 
  try {
    //  console.log("SECRET:", process.env.PAYSTACK_SECRET_KEY);
    const { email, totalPrice } = req.body;

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: totalPrice * 100, // convert to kobo
        metadata: req.body, // pass the entire request body as metadata
        callback_url: "https://hotel-backend-zo8h.onrender.com/api/payments/verify"
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    res.json({
      paymentUrl: response.data.data.authorization_url,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendBookingEmails = async (booking) => {

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    family: 4,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });


  try {

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: booking.email,
      subject: "Booking Confirmation",
      html: `
        <h2>Booking Confirmed</h2>
        <p>Hello ${booking.name},</p>
        <p>Your booking for <strong>${booking.roomName}</strong> has been confirmed.</p>
        <p><b>Check-in:</b> ${booking.checkIn}</p>
        <p><b>Check-out:</b> ${booking.checkOut}</p>
        <p>Thank you for choosing our service!</p>
      `
    });


    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Booking Received",
      html: `
        <h2>New Booking Received</h2>
        <p>${booking.name} booked ${booking.roomName}</p>
        <p>Email: ${booking.email}</p>
      `
    });


    console.log("Booking emails sent");

  } catch (error) {
    console.log("Email error:", error.message);
  }

};


export const verifyPayment = async (req, res) => {
  console.log("verifyPayment hit");
  const { reference } = req.query;
  console.log("Reference:", reference);

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = response.data.data;
    console.log("Paystsck response:")
    console.log(data);


    if (data.status !== "success") {
      return res.redirect("http://localhost:5173/payment-failed");
    }

    // 🔑 Get booking details from metadata
    console.log("Metadata:");
    console.log(data.metadata);
    const bookingData = data.metadata;

    // CHECK IF SAME USER ALREDY BOOKED THE ROOM FOR THE SAME DATES
    const userExistingBooking = await Booking.findOne({
      $or: [
        { userId: bookingData.userId },
        { email: bookingData.email }
      ],
      roomId: bookingData.roomId,
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      status: "confirmed",
    })

    if (userExistingBooking) {
      return res.status(400).json({
        message: "You have already booked this room for the selected dates.",
      });
    }

    // 🔥 GET REAL ROOM PRICE FROM DB / DATA
    const room = await Room.findById(bookingData.roomId);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const nights =
      (new Date(bookingData.checkOut) - new Date(bookingData.checkIn)) /
      (1000 * 60 * 60 * 24);

    const expectedAmount = room.price * nights * 100; // in kobo

    // ❌ VERY IMPORTANT CHECK
    if (data.amount !== expectedAmount) {
      return res.status(400).json({
        message: "Payment amount mismatch",
      });
    }

    // CHECK IF ROOM IS ALREADY BOOKED FOR THE SELECTED DATES
    const roomAlreadyBooked = await Booking.findOne({
      roomId: bookingData.roomId,
      checkIn: { $lt: bookingData.checkOut },
      checkOut: { $gt: bookingData.checkIn },
      status: "confirmed",
    })

    if (roomAlreadyBooked) {
      return res.status(400).json({
        message: "Room is already booked for the selected dates.",
      });
    }

    // ✅ SAVE BOOKING ONLY AFTER VALID PAYMENT
    console.log("saving booking...");
    const existingBooking = await Booking.findOne({
      paymentReference: reference,
    });


    if (existingBooking) {
      return res.redirect(
        `http://localhost:5173/payment-complete/${existingBooking._id}`
      );
    }

    const booking = await Booking.create({
      ...bookingData,
      status: "confirmed",
      paymentReference: reference,
      paymentStatus: "paid",
    });


    sendBookingEmails(booking).catch((error) => {
      console.log("Background email error:", error.message);
    });


    return res.redirect(
      `http://localhost:5173/payment-complete/${booking._id}`
    );

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};