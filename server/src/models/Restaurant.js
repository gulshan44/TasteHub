import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 150,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
            maxlength: 1000,
        },

        logo: {
            type: String,
            default: null,
        },

        phone: {
            type: String,
            trim: true,
        },

        email: {
            type: String,
            lowercase: true,
            trim: true,
        },

        address: {
            type: String,
            trim: true,
        },

        status: {
            type: String,
            enum: ["ACTIVE", "INACTIVE", "SUSPENDED"],
            default: "ACTIVE",
        },
    },
    {
        timestamps: true,
    }
);

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;