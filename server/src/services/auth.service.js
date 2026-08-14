import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import RefreshToken from "../models/RefreshToken.js";
import {
    generateAccessToken,
    generateRefreshToken,
    hashRefreshToken,
} from "../utils/jwt.js";

import ApiError from "../utils/ApiError.js";

import User from "../models/User.js";
import Restaurant from "../models/Restaurant.js";
import Membership from "../models/Membership.js";

const getRefreshTokenExpiry = () => {
    const days = Number(
        process.env.REFRESH_TOKEN_EXPIRES_DAYS || 7
    );

    return new Date(
        Date.now() + days * 24 * 60 * 60 * 1000
    );
};

export const registerUser = async ({
    name,
    email,
    password,
    restaurantName,
}) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const existingUser = await User.findOne({ email }).session(session);

        if (existingUser) {
            throw new ApiError(
                409,
                "Email is already registered"
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const [user] = await User.create(
            [
                {
                    name,
                    email,
                    password: hashedPassword,
                },
            ],
            { session }
        );

        const slug = restaurantName
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

        const existingRestaurant = await Restaurant.findOne({
            slug,
        }).session(session);

        if (existingRestaurant) {
            throw new ApiError(
                409,
                "A restaurant with this name already exists"
            );
        }

        const [restaurant] = await Restaurant.create(
            [
                {
                    name: restaurantName,
                    slug,
                },
            ],
            { session }
        );

        await Membership.create(
            [
                {
                    user: user._id,
                    restaurant: restaurant._id,
                    role: "OWNER",
                    status: "ACTIVE",
                },
            ],
            { session }
        );

        await session.commitTransaction();

        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            restaurant: {
                id: restaurant._id,
                name: restaurant.name,
                slug: restaurant.slug,
            },
        };
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
};


export const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email or password");
    }

    const accessToken = generateAccessToken({
        userId: user._id.toString(),
        role: user.role,
    });

    const refreshToken = generateRefreshToken();

    const tokenHash = hashRefreshToken(refreshToken);

    await RefreshToken.create({
        user: user._id,
        tokenHash,
        expiresAt: getRefreshTokenExpiry(),
    });

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
        accessToken,
        refreshToken,
    };
};


export const getCurrentUser = async (userId) => {
    const user = await User.findById(userId).select("-password");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return {
        id: user._id,
        name: user.name,
        email: user.email,
    };
};


export const refreshAccessToken = async (refreshToken) => {
    if (!refreshToken) {
        throw new ApiError(401, "Refresh token is required");
    }

    const tokenHash = hashRefreshToken(refreshToken);

    const storedToken = await RefreshToken.findOne({
        tokenHash,
    });

    if (!storedToken) {
        throw new ApiError(401, "Invalid refresh token");
    }

    if (storedToken.revokedAt) {
        throw new ApiError(401, "Refresh token has been revoked");
    }

    if (storedToken.expiresAt <= new Date()) {
        throw new ApiError(401, "Refresh token has expired");
    }

    const user = await User.findById(storedToken.user);

    if (!user) {
        throw new ApiError(401, "User not found");
    }

    if (user.status !== "ACTIVE") {
        throw new ApiError(
            403,
            "User account is not active"
        );
    }

    // Revoke old refresh token
    storedToken.revokedAt = new Date();
    await storedToken.save();

    // Generate new tokens
    const newAccessToken = generateAccessToken({
        userId: user._id.toString(),
        role: user.role,
    });

    const newRefreshToken = generateRefreshToken();

    const newTokenHash = hashRefreshToken(newRefreshToken);

    await RefreshToken.create({
        user: user._id,
        tokenHash: newTokenHash,
        expiresAt: getRefreshTokenExpiry(),
    });

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    };
};

export const logoutUser = async (refreshToken) => {
    if (!refreshToken) {
        throw new ApiError(400, "Refresh token is required");
    }

    const tokenHash = hashRefreshToken(refreshToken);

    const storedToken = await RefreshToken.findOne({
        tokenHash,
    });

    if (!storedToken) {
        throw new ApiError(401, "Invalid refresh token");
    }

    if (!storedToken.revokedAt) {
        storedToken.revokedAt = new Date();
        await storedToken.save();
    }

    return true;
};