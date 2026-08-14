import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },

        description: {
            type: String,
            trim: true,
            maxlength: 1000,
        },

        cuisines: [
            {
                type: String,
                trim: true,
                lowercase: true,
            },
        ],

        phone: {
            type: String,
            trim: true,
        },

        email: {
            type: String,
            trim: true,
            lowercase: true,
        },

        address: {
            street: {
                type: String,
                trim: true,
            },

            city: {
                type: String,
                trim: true,
            },

            state: {
                type: String,
                trim: true,
            },

            postalCode: {
                type: String,
                trim: true,
            },

            country: {
                type: String,
                trim: true,
                default: "India",
            },
        },

        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },

            coordinates: {
                type: [Number],
                default: undefined,
            },
        },

        images: [
            {
                type: String,
                trim: true,
            },
        ],

        openingHours: [
            {
                day: {
                    type: String,
                    enum: [
                        "monday",
                        "tuesday",
                        "wednesday",
                        "thursday",
                        "friday",
                        "saturday",
                        "sunday",
                    ],
                    required: true,
                },

                open: {
                    type: String,
                    trim: true,
                },

                close: {
                    type: String,
                    trim: true,
                },

                isClosed: {
                    type: Boolean,
                    default: false,
                },
            },
        ],

        priceRange: {
            type: String,
            enum: ["$", "$$", "$$$", "$$$$"],
            default: "$$",
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected", "suspended"],
            default: "pending",
            index: true,
        },

        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },

        rating: {
            average: {
                type: Number,
                default: 0,
                min: 0,
                max: 5,
            },

            count: {
                type: Number,
                default: 0,
                min: 0,
            },
        },
    },
    {
        timestamps: true,
    }
);

restaurantSchema.index({
    location: "2dsphere",
});

restaurantSchema.index({
    name: "text",
    description: "text",
    cuisines: "text",
});

const Restaurant = mongoose.model(
    "Restaurant",
    restaurantSchema
);

export default Restaurant;