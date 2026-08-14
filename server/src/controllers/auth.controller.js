import {
    registerUser,
    loginUser,
    getCurrentUser as getCurrentUserService,
    refreshAccessToken,
    logoutUser,
} from "../services/auth.service.js";

import ApiResponse from "../utils/ApiResponse.js";

export const register = async (req, res, next) => {
    try {
        const result = await registerUser(req.body);

        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    result,
                    "Registration successful"
                )
            );
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const result = await loginUser(req.body);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    result,
                    "Login successful"
                )
            );
    } catch (error) {
        next(error);
    }
};


export const getCurrentUser = async (req, res, next) => {
    try {
        const user = await getCurrentUserService(req.user.userId);

        return res.status(200).json(
            new ApiResponse(
                200,
                user,
                "Current user fetched successfully"
            )
        );
    } catch (error) {
        next(error);
    }
};


export const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken: token } = req.body;

        const tokens = await refreshAccessToken(token);

        return res.status(200).json(
            new ApiResponse(
                200,
                tokens,
                "Token refreshed successfully"
            )
        );
    } catch (error) {
        next(error);
    }
};


export const logout = async (req, res, next) => {
    try {
        const { refreshToken: token } = req.body;

        await logoutUser(token);

        return res.status(200).json(
            new ApiResponse(
                200,
                null,
                "Logout successful"
            )
        );
    } catch (error) {
        next(error);
    }
};