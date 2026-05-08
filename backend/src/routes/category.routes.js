import { Router } from "express";
import {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from "../controllers/category.controller.js";
import { verifyJWT, isAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/").get(getAllCategories).post(verifyJWT, isAdmin, createCategory);
router.route("/:id").patch(verifyJWT, isAdmin, updateCategory).delete(verifyJWT, isAdmin, deleteCategory);

export default router;
