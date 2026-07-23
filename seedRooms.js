import mongoose from "mongoose";
import dotenv from "dotenv";
import Room from "./src/models/Room.js";

dotenv.config();

const rooms = [
    {
        id: 1,
        name: "Deluxe Room",
        price: 120,
        guests: 2,
        images: [
            "https://images.unsplash.com/photo-1618773928121-c32242e63f39",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
            "https://images.unsplash.com/photo-1590490360182-c33d57733427"
        ],
        description:
            "Enjoy comfort and elegance with a king-size bed, high-speed WiFi, air conditioning, and complimentary breakfast.",
        amenities: ["wifi", "tv", "ac", "breakfast"],
    },
    {
        id: 2,
        name: "Executive Suite",
        price: 220,
        guests: 4,
        images: [
            "https://images.unsplash.com/photo-1591088398332-8a7791972843",
            "https://images.unsplash.com/photo-1611892440504-42a792e24d32",
            "https://images.unsplash.com/photo-1584132967334-10e028bd69f7"
        ],
        description:
            "Spacious suite perfect for business travelers with a lounge area and luxury amenities.",
        amenities: ["wifi", "tv", "ac", "breakfast"],
    },
    {
        id: 3,
        name: "Presidential Suite",
        price: 450,
        guests: 6,
        images: [
            "https://images.unsplash.com/photo-1566665797739-1674de7a421a",
            "https://images.unsplash.com/photo-1613977257363-707ba9348227",
            "https://images.unsplash.com/photo-1600585154526-990dced4db0d"
        ],
        description:
            "Our most luxurious suite offering premium comfort, large living space, and world-class services.",
        amenities: ["wifi", "tv", "ac", "breakfast"],
    },
    {
        id: 4,
        name: "Family Room",
        price: 180,
        guests: 5,
        images: [
            "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf",
            "https://images.unsplash.com/photo-1611892440504-42a792e24d32",
            "https://images.unsplash.com/photo-1582582621959-48d27397dc69"
        ],
        description:
            "Perfect for families with spacious beds and relaxing environment.",
        amenities: ["wifi", "tv", "ac"],
    },
    {
        id: 5,
        name: "Normal suite",
        price: 150,
        guests: 2,
        images: [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
        ], description:
            "A comfortable suite with all the essential amenities for a pleasant stay.",
        amenities: ["wifi", "tv", "ac"],
    },
    {
        id: 6,
        name: "Standard Room",
        price: 90,
        guests: 2,
        images: [
            "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4",
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461",
            "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa"
        ], description:
            "A cozy room with basic amenities, ideal for budget-conscious travelers.",
        amenities: ["wifi", "tv", "standing fan"],
    },
];


const seedRooms = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        await Room.insertMany(rooms);
        console.log("Rooms seeded successfully!");
        process.exit();
    } catch (error) {
        console.error("Error seeding rooms:", error);
        process.exit(1);
    }

}

seedRooms();