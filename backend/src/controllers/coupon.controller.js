import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Coupon } from "../models/coupon.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getAllCoupons = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find();
    return res.status(200).json(new ApiResponse(200, coupons, "Coupons fetched successfully"));
});

const createCoupon = asyncHandler(async (req, res) => {
    const { code, discount, expiryDate } = req.body;
    if (!code || !discount || !expiryDate) throw new ApiError(400, "All fields are required");

    const coupon = await Coupon.create({ code: code.toUpperCase(), discount, expiryDate });
    return res.status(201).json(new ApiResponse(201, coupon, "Coupon created successfully"));
});

const deleteCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) throw new ApiError(404, "Coupon not found");
    return res.status(200).json(new ApiResponse(200, {}, "Coupon deleted successfully"));
});

const validateCoupon = asyncHandler(async (req, res) => {
    const { code } = req.body;
    
    if (process.env.USE_MOCK_DB === 'true') {
        if (code?.toUpperCase() === 'VIP500') {
            return res.status(200).json(new ApiResponse(200, {
                _id: "mock_coupon_vip",
                code: "VIP500",
                discount: 25,
                type: 'percentage',
                expiryDate: "2030-01-01",
                isActive: true
            }, "VIP Coupon validated successfully!"));
        }
        if (code?.toUpperCase() === 'SAVE300') {
            return res.status(200).json(new ApiResponse(200, {
                _id: "mock_coupon_save300",
                code: "SAVE300",
                discount: 300,
                type: 'flat',
                expiryDate: "2030-01-01",
                isActive: true
            }, "Coupon validated successfully!"));
        }
        if (code?.toUpperCase() === 'WELCOME10') {
            return res.status(200).json(new ApiResponse(200, {
                _id: "mock_coupon_welcome10",
                code: "WELCOME10",
                discount: 10,
                type: 'percentage',
                expiryDate: "2030-01-01",
                isActive: true
            }, "Welcome Coupon validated successfully!"));
        }
        throw new ApiError(404, "Invalid coupon code (Mock Mode)");
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (new Date(coupon.expiryDate) < new Date()) {
        throw new ApiError(400, "Coupon has expired");
    }

    return res.status(200).json(new ApiResponse(200, coupon, "Coupon validated successfully"));
});

export {
    getAllCoupons,
    createCoupon,
    deleteCoupon,
    validateCoupon
};
