import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Mock DB Data
let mockAddresses = [];

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token");
    }
};

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, username, password } = req.body;

    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // MOCK DB LOGIC
    if (process.env.USE_MOCK_DB === "true") {
        return res.status(201).json(
            new ApiResponse(200, { fullName, email, username }, "User registered Successfully (Mock Mode)")
        );
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    const user = await User.create({
        fullName,
        email,
        username: username.toLowerCase(),
        password,
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    );
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    if (!(username || email)) {
        throw new ApiError(400, "username or email is required");
    }

    // MOCK DB LOGIC
    if (process.env.USE_MOCK_DB === "true") {
        const isAdmin = email === 'admin@gmail.com' && password === 'admin1234';
        
        const mockUser = {
            _id: isAdmin ? "admin_user_999" : "mock_user_123",
            fullName: isAdmin ? "System Admin" : "Demo User",
            username: username || (isAdmin ? "admin" : "demo_user"),
            email: email || (isAdmin ? "admin@gmail.com" : "demo@example.com"),
            avatar: "/default-avatar.svg",
            role: isAdmin ? "ADMIN" : "USER"
        };
        const mockAccessToken = isAdmin ? "mock_admin_token_jwt" : "mock_access_token_jwt";
        
        return res
            .status(200)
            .cookie("accessToken", mockAccessToken, { httpOnly: true, secure: true })
            .json(
                new ApiResponse(
                    200,
                    { user: mockUser, accessToken: mockAccessToken },
                    "User logged In Successfully (Mock Mode)"
                )
            );
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged In Successfully"
            )
        );

});

const logoutUser = asyncHandler(async (req, res) => {
    // MOCK DB LOGIC
    if (process.env.USE_MOCK_DB === "true") {
        const options = { httpOnly: true, secure: true };
        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse(200, {}, "User logged out (Mock Mode)"));
    }

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    );

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const options = {
            httpOnly: true,
            secure: true
        };

        const { accessToken, newRefreshToken } = await generateAccessAndRefereshTokens(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
    // MOCK DB LOGIC
    if (process.env.USE_MOCK_DB === "true") {
        const mockUser = { 
            ...(req.user || { fullName: "Demo User", email: "demo@example.com" }), 
            addresses: mockAddresses 
        };
        return res
            .status(200)
            .json(new ApiResponse(200, mockUser, "Current user fetched (Mock Mode)"));
    }
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body;

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email
            }
        },
        { new: true }
    ).select("-password");

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing");
    }

    // upload on cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Error while uploading on avatar");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    ).select("-password");

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Avatar image updated successfully"));
});

const getWishlist = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate("wishlist");
    return res.status(200).json(new ApiResponse(200, user.wishlist, "Wishlist fetched successfully"));
});

const addToWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $addToSet: { wishlist: productId } },
        { new: true }
    );
    return res.status(200).json(new ApiResponse(200, user.wishlist, "Product added to wishlist"));
});

const removeFromWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { wishlist: productId } },
        { new: true }
    );
    return res.status(200).json(new ApiResponse(200, user.wishlist, "Product removed from wishlist"));
});

const getRecentlyViewed = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate("recentlyViewed");
    return res.status(200).json(new ApiResponse(200, user.recentlyViewed, "Recently viewed products fetched successfully"));
});

const addToRecentlyViewed = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);
    
    // Remove if already exists to move it to front
    user.recentlyViewed = user.recentlyViewed.filter(id => id.toString() !== productId);
    user.recentlyViewed.unshift(productId);
    
    // Keep only last 10
    if (user.recentlyViewed.length > 10) {
        user.recentlyViewed.pop();
    }
    
    await user.save({ validateBeforeSave: false });
    return res.status(200).json(new ApiResponse(200, user.recentlyViewed, "Recently viewed updated"));
});

const addAddress = asyncHandler(async (req, res) => {
    const { street, city, state, zipCode, country, isDefault } = req.body;
    
    // MOCK DB LOGIC
    if (process.env.USE_MOCK_DB === "true") {
        const mockAddress = { 
            _id: "mock_address_" + Date.now(), 
            street, city, state, zipCode, country, 
            isDefault: isDefault || mockAddresses.length === 0
        };
        if (mockAddress.isDefault) {
            mockAddresses.forEach(a => a.isDefault = false);
        }
        mockAddresses.push(mockAddress);
        return res.status(200).json(new ApiResponse(200, mockAddresses, "Address added successfully (Mock Mode)"));
    }

    const user = await User.findById(req.user._id);
    
    if (isDefault) {
        user.addresses.forEach(addr => addr.isDefault = false);
    }
    
    user.addresses.push({ street, city, state, zipCode, country, isDefault: isDefault || user.addresses.length === 0 });
    await user.save({ validateBeforeSave: false });
    
    return res.status(200).json(new ApiResponse(200, user.addresses, "Address added successfully"));
});

const removeAddress = asyncHandler(async (req, res) => {
    const { addressId } = req.params;
    
    // MOCK DB LOGIC
    if (process.env.USE_MOCK_DB === "true") {
        mockAddresses = mockAddresses.filter(addr => addr._id !== addressId);
        return res.status(200).json(new ApiResponse(200, mockAddresses, "Address removed successfully (Mock Mode)"));
    }

    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter(addr => addr._id.toString() !== addressId);
    
    await user.save({ validateBeforeSave: false });
    return res.status(200).json(new ApiResponse(200, user.addresses, "Address removed successfully"));
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    getRecentlyViewed,
    addToRecentlyViewed,
    addAddress,
    removeAddress
};
