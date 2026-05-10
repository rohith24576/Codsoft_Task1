import { Router } from "express";
import { shoppingAssistant } from "../controllers/ai.controller.js";

const router = Router();

// For all users (including guests)
router.route("/chat").post(shoppingAssistant);

export default router;
