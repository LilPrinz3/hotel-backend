import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    guests: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
        required: true,
    },
    amenities: {
        type: [String],
        required: true,
        default: [],
    },
});

export default mongoose.model("Room", roomSchema);