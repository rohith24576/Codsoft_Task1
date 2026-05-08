import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Order } from "../models/order.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";

const createOrder = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        throw new ApiError(400, "No order items");
    }

    // MOCK DB LOGIC
    if (process.env.USE_MOCK_DB === "true") {
        const mockOrder = {
            _id: "mock_order_" + Date.now(),
            orderItems,
            user: req.user?._id || "mock_user_123",
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            isPaid: true,
            paidAt: new Date(),
            createdAt: new Date(),
        };
        return res.status(201).json(new ApiResponse(201, mockOrder, "Order created successfully (Mock Mode)"));
    }

    const order = new Order({
        orderItems: orderItems.map((x) => ({
            ...x,
            product: x.product,
            _id: undefined,
        })),
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    });

    const createdOrder = await order.save();

    // Update stock
    for (const item of orderItems) {
        await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.qty }
        });
    }

    return res.status(201).json(new ApiResponse(201, createdOrder, "Order created successfully"));
});

const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate("user", "fullName email");

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    return res.status(200).json(new ApiResponse(200, order, "Order fetched successfully"));
});

const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        };

        const updatedOrder = await order.save();
        return res.status(200).json(new ApiResponse(200, updatedOrder, "Order paid successfully"));
    } else {
        throw new ApiError(404, "Order not found");
    }
});

const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        order.status = "Delivered";

        const updatedOrder = await order.save();
        return res.status(200).json(new ApiResponse(200, updatedOrder, "Order delivered successfully"));
    } else {
        throw new ApiError(404, "Order not found");
    }
});

const getMyOrders = asyncHandler(async (req, res) => {
    // MOCK DB LOGIC
    if (process.env.USE_MOCK_DB === "true") {
        return res.status(200).json(new ApiResponse(200, [], "Orders fetched successfully (Mock Mode)"));
    }
    const orders = await Order.find({ user: req.user._id });
    return res.status(200).json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate("user", "id fullName");
    return res.status(200).json(new ApiResponse(200, orders, "All orders fetched successfully"));
});

const getSalesAnalytics = asyncHandler(async (req, res) => {
    const orders = await Order.find({ isPaid: true });
    
    const totalSales = orders.reduce((acc, order) => acc + order.totalPrice, 0);
    const totalOrders = orders.length;
    
    // Monthly sales (last 6 months)
    const monthlySales = await Order.aggregate([
        { $match: { isPaid: true } },
        {
            $group: {
                _id: { $month: "$paidAt" },
                total: { $sum: "$totalPrice" }
            }
        },
        { $sort: { "_id": 1 } }
    ]);

    return res.status(200).json(new ApiResponse(200, { totalSales, totalOrders, monthlySales }, "Analytics fetched successfully"));
});

export {
    createOrder,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getMyOrders,
    getAllOrders,
    getSalesAnalytics
};
