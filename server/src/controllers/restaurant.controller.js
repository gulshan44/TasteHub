import {
    createRestaurantService,
    getMyRestaurantsService,
    getRestaurantBySlugService,
    getPendingRestaurantsService,
    approveRestaurantService,
    rejectRestaurantService,
    updateRestaurantService,
    deactivateRestaurantService,
} from "../services/restaurant.service.js";

import ApiResponse from "../utils/ApiResponse.js";

export const createRestaurant = async (req, res, next) => {
    try {
        const restaurant = await createRestaurantService(
            req.user.userId,
            req.body
        );

        return res.status(201).json(
            new ApiResponse(
                201,
                restaurant,
                "Restaurant created successfully"
            )
        );
    } catch (error) {
        next(error);
    }
};


export const getMyRestaurants = async (req, res, next) => {
    try {
        const restaurants = await getMyRestaurantsService(
            req.user.userId
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                restaurants,
                "Restaurants fetched successfully"
            )
        );
    } catch (error) {
        next(error);
    }
};


export const getRestaurantBySlug = async (req, res, next) => {
    try {
        const restaurant = await getRestaurantBySlugService(
            req.params.slug
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                restaurant,
                "Restaurant fetched successfully"
            )
        );
    } catch (error) {
        next(error);
    }
};

export const getPendingRestaurants = async (req, res, next) => {
    try {
        const restaurants = await getPendingRestaurantsService();

        return res.status(200).json(
            new ApiResponse(
                200,
                restaurants,
                "Pending restaurants fetched successfully"
            )
        );
    } catch (error) {
        next(error);
    }
};

export const approveRestaurant = async (req, res, next) => {
    try {
        const restaurant = await approveRestaurantService(
            req.params.id
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                restaurant,
                "Restaurant approved successfully"
            )
        );
    } catch (error) {
        next(error);
    }
};

export const rejectRestaurant = async (req, res, next) => {
    try {
        const restaurant = await rejectRestaurantService(
            req.params.id
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                restaurant,
                "Restaurant rejected successfully"
            )
        );
    } catch (error) {
        next(error);
    }
};

export const updateRestaurant = async (req, res, next) => {
    try {
        const restaurant = await updateRestaurantService(
            req.params.id,
            req.user.userId,
            req.user.role,
            req.body
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                restaurant,
                "Restaurant updated successfully"
            )
        );
    } catch (error) {
        next(error);
    }
};

export const deactivateRestaurant = async (req, res, next) => {
    try {
        const restaurant = await deactivateRestaurantService(
            req.params.id,
            req.user.userId,
            req.user.role
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                restaurant,
                "Restaurant deactivated successfully"
            )
        );
    } catch (error) {
        next(error);
    }
};