import { z } from "zod";

export const validateUserRegister = z.object({
  name: z.string().min(1, { message: "username is required" }),
  email: z.email().min(1, { message: "Email is required" }),
  password: z.string().min(6, { message: "Password must be 6 characters" }),
});

export const validateUserLogin = z.object({
  email: z.email().min(1, { message: "Email is required" }),
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
  price: z.coerce
    .number()
    .positive({ message: "Price must be greater than 0" }),
  area_sqft: z.coerce
    .number()
    .int()
    .positive({ message: "Area must be a positive number" }),
  bedrooms: z.coerce.number().int().min(0).optional(),
  bathrooms: z.coerce.number().int().min(0).optional(),
  parking: z.boolean().default(false),
  address: z.string().min(1, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  pincode: z.string().regex(/^[0-9]{6}$/, { message: "Invalid pincode" }),
  owner_name: z.string().optional(),
  owner_contact: z
    .string()
    .regex(/^[6-9]\d{9}$/, { message: "Invalid mobile number" })
    .optional(),
});
