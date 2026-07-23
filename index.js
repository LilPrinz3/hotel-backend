import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bookingRoutes from "./src/routes/bookingRoute.js";
import authRoutes from "./src/routes/authRoute.js";
import userRoutes from "./src/routes/userRoute.js"
import roomRoutes from "./src/routes/roomRoute.js";
import paymentRoutes from "./src/routes/paymentRoute.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes)
app.use("/api/rooms", roomRoutes);
app.use("/api/payments", paymentRoutes);
// DB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});