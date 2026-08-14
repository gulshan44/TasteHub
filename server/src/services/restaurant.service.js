import Restaurant from "../models/Restaurant.js";
import ApiError from "../utils/ApiError.js";

const generateSlug = (name) => {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
};

const createUniqueSlug = async (name) => {
    const baseSlug = generateSlug(name);

    let slug = baseSlug;
    let counter = 1;

    while (await Restaurant.exists({ slug })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    return slug;
};

export const createRestaurantService = async (userId, restaurantData) => {
    const {
        name,
        description,
        cuisines,
        phone,
        email,
        address,
        location,
        images,
        openingHours,
        priceRange,
    } = restaurantData;

    const slug = await createUniqueSlug(name);

    const restaurant = await Restaurant.create({
        owner: userId,

        name,
        slug,
        description,
        cuisines,
        phone,
        email,
        address,
        location: location
            ? {
                type: "Point",
                coordinates: location.coordinates,
            }
            : undefined,
        images,
        openingHours,
        priceRange,

        // Backend controlled fields
        status: "pending",
        isActive: true,
    });

    return restaurant;
};

export const getMyRestaurantsService = async (userId) => {
    const restaurants = await Restaurant.find({
        owner: userId,
    }).sort({ createdAt: -1 });

    return restaurants;
};

export const getRestaurantBySlugService = async (slug) => {
    const restaurant = await Restaurant.findOne({
        slug,
        status: "approved",
        isActive: true,
    }).populate("owner", "name avatar");

    if (!restaurant) {
        throw new ApiError(404, "Restaurant not found");
    }

    return restaurant;
};

export const getPendingRestaurantsService = async () => {
    const restaurants = await Restaurant.find({
        status: "pending",
    })
        .populate("owner", "name email avatar")
        .sort({ createdAt: -1 });

    return restaurants;
};

export const approveRestaurantService = async (restaurantId) => {
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
        throw new ApiError(404, "Restaurant not found");
    }

    if (restaurant.status !== "pending") {
        throw new ApiError(
            400,
            `Restaurant is already ${restaurant.status}`
        );
    }

    restaurant.status = "approved";

    await restaurant.save();

    return restaurant;
};

export const rejectRestaurantService = async (restaurantId) => {
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
        throw new ApiError(404, "Restaurant not found");
    }

    if (restaurant.status !== "pending") {
        throw new ApiError(
            400,
            `Restaurant is already ${restaurant.status}`
        );
    }

    restaurant.status = "rejected";

    await restaurant.save();

    return restaurant;
};

export const updateRestaurantService = async (
    restaurantId,
    userId,
    userRole,
    updateData
) => {
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
        throw new ApiError(404, "Restaurant not found");
    }

    const isOwner =
        restaurant.owner.toString() === userId.toString();

    const isAdmin = userRole === "admin";

    if (!isOwner && !isAdmin) {
        throw new ApiError(
            403,
            "You do not have permission to update this restaurant"
        );
    }

    const allowedFields = [
        "name",
        "description",
        "cuisines",
        "phone",
        "email",
        "address",
        "location",
        "images",
        "openingHours",
        "priceRange",
    ];

    for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
            restaurant[field] = updateData[field];
        }
    }

    if (updateData.name) {
        restaurant.slug = await createUniqueSlug(
            updateData.name
        );
    }

    await restaurant.save();

    return restaurant;
};

export const deactivateRestaurantService = async (
    restaurantId,
    userId,
    userRole
) => {
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
        throw new ApiError(404, "Restaurant not found");
    }

    const isOwner =
        restaurant.owner.toString() === userId.toString();

    const isAdmin = userRole === "admin";

    if (!isOwner && !isAdmin) {
        throw new ApiError(
            403,
            "You do not have permission to deactivate this restaurant"
        );
    }

    restaurant.isActive = false;

    await restaurant.save();

    return restaurant;
};