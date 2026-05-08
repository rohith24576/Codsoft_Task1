import mongoose, { Schema } from 'mongoose';

const couponSchema = new Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        },
        discount: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        expiryDate: {
            type: Date,
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

export const Coupon = mongoose.model("Coupon", couponSchema);
