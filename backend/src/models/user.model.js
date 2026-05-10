import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avatar: {
            type: String, // cloudinary url
            default: "https://res.cloudinary.com/dqr6i6z7o/image/upload/v1692110000/avatar-placeholder.png"
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        role: {
            type: String,
            enum: ["USER", "ADMIN"],
            default: "USER"
        },
        wishlist: [
            {
                type: Schema.Types.ObjectId,
                ref: "Product"
            }
        ],
        recentlyViewed: [
            {
                type: Schema.Types.ObjectId,
                ref: "Product"
            }
        ],
        addresses: [
            {
                street: String,
                city: String,
                state: String,
                zipCode: String,
                country: String,
                isDefault: { type: Boolean, default: false }
            }
        ],
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName,
            role: this.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "10d"
        }
    );
};

export const User = mongoose.model("User", userSchema);
