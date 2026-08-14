import { z } from "zod";

const openingHourSchema = z.object({
    day: z.enum([
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
    ]),

    open: z.string().trim().optional(),

    close: z.string().trim().optional(),

    isClosed: z.boolean().default(false),
});

const addressSchema = z.object({
    street: z.string().trim().max(200).optional(),

    city: z.string().trim().max(100).optional(),

    state: z.string().trim().max(100).optional(),

    postalCode: z.string().trim().max(20).optional(),

    country: z.string().trim().max(100).default("India"),
});

const locationSchema = z.object({
    coordinates: z
        .array(z.number())
        .length(2)
        .optional(),
});

export const createRestaurantSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Restaurant name must be at least 2 characters")
        .max(100, "Restaurant name cannot exceed 100 characters"),

    description: z
        .string()
        .trim()
        .max(1000, "Description cannot exceed 1000 characters")
        .optional(),

    cuisines: z
        .array(z.string().trim().min(1))
        .min(1, "At least one cuisine is required"),

    phone: z
        .string()
        .trim()
        .optional(),

    email: z
        .string()
        .trim()
        .email("Invalid restaurant email")
        .optional(),

    address: addressSchema.optional(),

    location: locationSchema.optional(),

    images: z
        .array(z.string().url("Invalid image URL"))
        .max(10, "Maximum 10 images are allowed")
        .optional(),

    openingHours: z
        .array(openingHourSchema)
        .max(7, "Maximum 7 opening-hour entries are allowed")
        .optional(),

    priceRange: z
        .enum(["$", "$$", "$$$", "$$$$"])
        .default("$$"),
});

export const updateRestaurantSchema = createRestaurantSchema
    .partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        {
            message: "At least one field is required for update",
        }
    );