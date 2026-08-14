import { Router } from "express";

import {
    createRestaurant,
    getMyRestaurants,
    getRestaurantBySlug,
    getPendingRestaurants,
    approveRestaurant,
    rejectRestaurant,
    updateRestaurant,
    deactivateRestaurant,
} from "../controllers/restaurant.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";

import validate from "../middleware/validate.middleware.js";

import {
    createRestaurantSchema,
    updateRestaurantSchema,
} from "../validators/restaurant.validator.js";

const router = Router();

router.post(
    "/",
    authMiddleware,
    authorize("owner", "admin"),
    validate(createRestaurantSchema),
    createRestaurant
);

router.get(
    "/my",
    authMiddleware,
    authorize("owner", "admin"),
    getMyRestaurants
);

router.get(
    "/admin/pending",
    authMiddleware,
    authorize("admin"),
    getPendingRestaurants
);

router.patch(
    "/admin/:id/approve",
    authMiddleware,
    authorize("admin"),
    approveRestaurant
);

router.patch(
    "/admin/:id/reject",
    authMiddleware,
    authorize("admin"),
    rejectRestaurant
);

router.patch(
    "/:id",
    authMiddleware,
    authorize("owner", "admin"),
    validate(updateRestaurantSchema),
    updateRestaurant
);

router.patch(
  "/:id/deactivate",
  authMiddleware,
  authorize("owner", "admin"),
  deactivateRestaurant
);

router.get("/:slug", getRestaurantBySlug);

export default router;