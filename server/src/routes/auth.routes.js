import { Router } from "express";
import validate from "../middleware/validate.middleware.js";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  registerSchema,
  loginSchema,
} from "../validators/auth.validator.js";

import {
  register,
  login,
  getCurrentUser,
  refreshToken,
  logout,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

router.get("/me", authMiddleware, getCurrentUser);

router.post("/refresh", refreshToken);
router.post("/logout", logout);

export default router;