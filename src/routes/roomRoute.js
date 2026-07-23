import express from "express";
import { getRooms, getRoomById } from "../controller/roomController.js";

const router = express.Router();

router.get("/", getRooms);
router.get("/:id", getRoomById);

export default router;