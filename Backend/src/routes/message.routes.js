import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getMessage,
  getUserforSidebar,
  sendMessage,
} from "../controller/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUserforSidebar);
router.get("/:id", protectRoute, getMessage);

router.post("/send/:id", protectRoute, sendMessage);

export default router;
