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
            // For mock testing, we'll assume a token starting with 'mock_admin' is an admin
            const isAdminToken = token.includes("admin");
            req.user = {
                _id: isAdminToken ? "admin_user_999" : "mock_user_123",
                fullName: isAdminToken ? "System Admin" : "Demo User",
                username: isAdminToken ? "admin" : "demo_user",
                email: isAdminToken ? "admin@gmail.com" : "demo@example.com",
                role: isAdminToken ? "ADMIN" : "USER"
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
