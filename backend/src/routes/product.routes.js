import { Router } from "express";
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getFeaturedProducts,
    createProductReview,
    getRelatedProducts,
    getProductsByCategory
} from "../controllers/product.controller.js";
import { verifyJWT, isAdmin } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.route("/").get(getAllProducts).post(verifyJWT, isAdmin, upload.array("images", 5), createProduct);
router.route("/featured").get(getFeaturedProducts);
router.route("/category/:categoryId").get(getProductsByCategory);
router.route("/:id").get(getProductById).patch(verifyJWT, isAdmin, upload.array("images", 5), updateProduct).delete(verifyJWT, isAdmin, deleteProduct);
router.route("/:id/reviews").post(verifyJWT, createProductReview);
router.route("/:id/related").get(getRelatedProducts);

export default router;
