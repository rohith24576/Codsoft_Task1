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
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
        throw new ApiError(404, "Invalid coupon code");
    }

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
