import { z } from "zod";

export const validateUserLogin = z.object({
  email: z.string().email().min(1, { message: "Email is required" }),
  password: z.string().min(6, { message: "Password must be 6 characters" }),
});

export const validateCreateProperty = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  property_type: z.enum(
    ["apartment", "villa", "plot", "commercial", "office"],
    { message: "Invalid property type" }
  ),
  status: z
    .enum(["available", "sold", "rented", "under_construction"])
    .default("available"),
  price: z.preprocess((val) => (val === "" ? undefined : val), z.coerce.number().positive({ message: "Price must be greater than 0" })),
  area_sqft: z.preprocess((val) => (val === "" ? undefined : val), z.coerce.number().int().positive({ message: "Area must be a positive number" })),
  bedrooms: z.preprocess((val) => (val === "" ? null : val), z.coerce.number().int().min(0).nullable().optional()),
  bathrooms: z.preprocess((val) => (val === "" ? null : val), z.coerce.number().int().min(0).nullable().optional()),
  parking: z.preprocess((val) => val === 'true' || val === true, z.boolean()).default(false),
  address: z.string().min(1, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  pincode: z.string().regex(/^[0-9]{6}$/, { message: "Pincode must be exactly 6 digits" }),
  owner_name: z.string().optional(),
  owner_contact: z
    .string()
    .regex(/^[6-9]\d{9}$/, { message: "Invalid 10-digit mobile number starting with 6-9" })
    .optional(),
  images: z.array(z.string()).optional(),
});
