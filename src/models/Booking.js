import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        roomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
            required: [true, "Room ID is required"],
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        roomName: {
            type: String,
            required: [true, "Room name is required"],
            trim: true,
        },

        name: {
            type: String,
            required: [true, "Full name is required"],
            trim: true,
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
        },

        checkIn: {
            type: Date,
            required: [true, "Check-in date is required"],
        },

        checkOut: {
            type: Date,
            required: true,
            validate: {
                validator: function (value) {
                    return value > this.checkIn;
                },
                message: "Check-out must be after check-in",
            },
        },

        guests: {
            type: Number,
            required: [true, "Number of guests is required"],
            min: [1, "At least 1 guest is required"],
        },

        totalPrice: {
            type: Number,
            required: [true, "Total price is required"],
            min: [0, "Price cannot be negative"],
        },

        status: {
            type: String,
            enum: ["confirmed", "completed", "cancelled"],
            default: "confirmed",
        },

        paymentRefrence: {
            type: String,
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);