import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
            required: true,
        },

        role: {
            type: String,
            enum: ["OWNER", "MANAGER", "STAFF", "KITCHEN"],
            default: "STAFF",
        },

        status: {
            type: String,
            enum: ["ACTIVE", "INVITED", "SUSPENDED"],
            default: "ACTIVE",
        },
    },
    {
        timestamps: true,
    }
);

membershipSchema.index(
    { user: 1, restaurant: 1 },
    { unique: true }
);

const Membership = mongoose.model("Membership", membershipSchema);

export default Membership;