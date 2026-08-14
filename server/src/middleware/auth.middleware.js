import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new ApiError(401, "Authentication required");
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            throw new ApiError(401, "Authentication required");
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not configured");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            userId: decoded.userId,
            role: decoded.role,
        };

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return next(new ApiError(401, "Access token has expired"));
        }

        if (error.name === "JsonWebTokenError") {
            return next(new ApiError(401, "Invalid access token"));
        }

        next(error);
    }
};

export default authMiddleware;