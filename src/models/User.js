import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
    fullname: {
        type: String,
        required: [true, "Fullname is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please use a valid email"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"],
    },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        }
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);