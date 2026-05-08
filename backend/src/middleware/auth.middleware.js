import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        // MOCK DB LOGIC
        if (process.env.USE_MOCK_DB === "true" && (token === "mock_access_token_jwt" || token.startsWith("mock_"))) {
            req.user = {
                _id: "mock_user_123",
                fullName: "Demo User",
                username: "demo_user",
                email: "demo@example.com",
                role: "ADMIN" // Giving admin rights for easy testing
            };
            return next();
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "ADMIN") {
        next();
    } else {
        throw new ApiError(403, "Admin resource. Access denied.");
    }
};
