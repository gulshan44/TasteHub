import jwt from "jsonwebtoken";
import crypto from "crypto";

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return process.env.JWT_SECRET;
};

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

export const hashRefreshToken = (token) => {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
};