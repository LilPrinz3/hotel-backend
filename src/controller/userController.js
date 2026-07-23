import User from "../models/User.js";

// GET ALL USERS (ADMIN)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// MAKE USER ADMIN
export const makeAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = "admin";
    await user.save();

    res.json({ message: "User promoted to admin" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};