import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Booking from "../models/Booking.js";

// 🔐 GENERATE TOKEN
const generateToken = (user) => {
    return jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN,
        }
    );
};


// 📝 REGISTER
export const registerUser = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        // Check existing user
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                message: "Email already in use",
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            fullname,
            email,
            password: hashedPassword,

        });
        res.status(201).json({
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            role: user.role,
            token: generateToken(user),
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// 🔓 LOGIN
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            await Booking.updateMany(
                { email: user.email, userId: null },
                { $set: { userId: user._id } }
            );
            res.json({
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: user.role,
                token: generateToken(user),
            });
        } else {
            res.status(401).json({
                message: "Invalid email or password",
            });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// export const getUser = async (req, res) => {
//     const decodedID = req.user.userId

//     try {
//         const user = await User.findById(decodedID)
//         console.log(user)
//         res.status(200).json(user)
//     } catch (error) {
//         console.log(error)
//     }
// }