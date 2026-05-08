import { Router } from "express";
import {
    loginUser,
    logoutUser,
    registerUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    getRecentlyViewed,
    addToRecentlyViewed
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);

router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

router.route("/wishlist").get(verifyJWT, getWishlist);
router.route("/wishlist/:productId").post(verifyJWT, addToWishlist).delete(verifyJWT, removeFromWishlist);

router.route("/recently-viewed").get(verifyJWT, getRecentlyViewed);
router.route("/recently-viewed/:productId").post(verifyJWT, addToRecentlyViewed);

export default router;
