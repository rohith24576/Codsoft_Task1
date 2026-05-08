import { Router } from "express";
import {
    getAllCoupons,
    createCoupon,
    deleteCoupon,
    validateCoupon
} from "../controllers/coupon.controller.js";
import { verifyJWT, isAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/").get(verifyJWT, isAdmin, getAllCoupons).post(verifyJWT, isAdmin, createCoupon);
router.route("/validate").post(verifyJWT, validateCoupon);
router.route("/:id").delete(verifyJWT, isAdmin, deleteCoupon);

export default router;
