import { Router } from "express";
import {
    createOrder,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getMyOrders,
    getAllOrders,
    getSalesAnalytics
} from "../controllers/order.controller.js";
import { verifyJWT, isAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/").post(verifyJWT, createOrder).get(verifyJWT, isAdmin, getAllOrders);
router.route("/mine").get(verifyJWT, getMyOrders);
router.route("/analytics").get(verifyJWT, isAdmin, getSalesAnalytics);
router.route("/:id").get(verifyJWT, getOrderById);
router.route("/:id/pay").patch(verifyJWT, updateOrderToPaid);
router.route("/:id/deliver").patch(verifyJWT, isAdmin, updateOrderToDelivered);

export default router;
