import { z } from "zod";

export const validateUserLogin = z.object({
  email: z.string().email().min(1, { message: "Email is required" }),
  password: z.string().min(6, { message: "Password must be 6 characters" }),
});

export const validateCreateProperty = z.object({
  // Basic info
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  
  // Property categorization
  property_category: z.enum(
    ["residential", "commercial", "industrial"],
    { message: "Invalid property category" }
  ),
  property_type: z.enum(
    ["apartment", "flat", "villa", "plot", "office", "shop", "warehouse", "factory", "industrial_shed"],
    { message: "Invalid property type" }
  ),
  transaction_type: z.enum(
    ["sale", "rent"],
    { message: "Transaction type must be sale or rent" }
  ),
  
  // Pricing (conditional based on transaction_type)
  price: z.preprocess(
    (val) => val === "" || val === undefined ? undefined : Number(val),
    z.number().positive({ message: "Sale price must be greater than 0" }).optional()
  ),
  monthly_rent: z.preprocess(
    (val) => val === "" || val === undefined ? undefined : Number(val),
    z.number().positive({ message: "Monthly rent must be greater than 0" }).optional()
  ),
  security_deposit: z.preprocess(
    (val) => val === "" || val === undefined ? undefined : Number(val),
    z.number().nonnegative().optional()
  ),
  
  // Status
  status: z.enum(["available", "sold", "rented"]).default("available"),
  
  // Area measurements
  area_sqft: z.preprocess(
    (val) => val === "" || val === undefined ? undefined : Number(val),
    z.number().positive({ message: "Area must be a positive number" })
  ),
  usable_carpet_area: z.preprocess(
    (val) => val === "" || val === undefined ? undefined : Number(val),
    z.number().positive().optional()
  ),
  rera_carpet_area: z.preprocess(
    (val) => val === "" || val === undefined ? undefined : Number(val),
    z.number().positive().optional()
  ),
  
  // Room configuration
  bedrooms: z.preprocess(
    (val) => val === "" || val === undefined ? undefined : Number(val),
    z.number().int().min(0).optional()
  ),
  bathrooms: z.preprocess(
    (val) => val === "" || val === undefined ? undefined : Number(val),
    z.number().int().min(0).optional()
  ),
  kitchens: z.preprocess(
    (val) => val === "" || val === undefined ? undefined : Number(val),
    z.number().int().min(0).optional()
  ),
  halls: z.preprocess(
    (val) => val === "" || val === undefined ? undefined : Number(val),
    z.number().int().min(0).optional()
  ),
  bhk_type: z.preprocess(
    (val) => val === "" ? undefined : val,
    z.string().optional()
  ),
  parking: z.preprocess(
    (val) => {
      if (val === 'false' || val === false) return false;
      if (val === 'true' || val === true) return true;
      return false;
    },
    z.boolean()
  ).default(false),
  
  // Detailed address fields
  flat_office_no: z.string().optional(),
  wing_block_tower: z.string().optional(),
  floor_no: z.string().optional(),
  building_society_name: z.string().optional(),
  plot_cts_survey_no: z.string().optional(),
  street_road_name: z.string().optional(),
  landmark: z.string().optional(),
  local_area_sector: z.string().optional(),
  area_locality: z.string().optional(),
  
  // Administrative location (required)
  city: z.string().min(1, { message: "City is required" }),
  district: z.string().min(1, { message: "District is required" }),
  state: z.string().min(1, { message: "State is required" }),
  pincode: z.string().regex(/^[0-9]{6}$/, { message: "Pincode must be exactly 6 digits" }),
  
  // Accessibility
  truck_access_available: z.preprocess(
    (val) => val === 'true' || val === true,
    z.boolean()
  ).optional(),
  
  // Furnishing
  furnishing_status: z.preprocess(
    (val) => val === "" ? undefined : val,
    z.enum(
      ["furnished", "semi-furnished", "unfurnished"],
      { message: "Invalid furnishing status" }
    ).optional()
  ),
  furnishings: z.preprocess(
    (val) => {
      if (!val) return [];
      if (typeof val === 'string') {
        try {
          return JSON.parse(val);
        } catch (e) {
          return [];
        }
      }
      return Array.isArray(val) ? val : [];
    },
    z.array(z.string()).default([])
  ),
  
  // Owner info
  owner_name: z.string().min(1, { message: "Owner name is required" }),
  owner_contact: z.string()
    .regex(/^[6-9]\d{9}$/, { message: "Invalid 10-digit mobile number starting with 6-9" }),
  
  // Images
  images: z.array(z.string()).optional(),
}).refine(
  (data) => {
    // If transaction_type is 'sale', price is required
    if (data.transaction_type === 'sale') {
      return data.price !== undefined && data.price > 0;
    }
    // If transaction_type is 'rent', monthly_rent is required
    if (data.transaction_type === 'rent') {
      return data.monthly_rent !== undefined && data.monthly_rent > 0;
    }
    return true;
  },
  {
    message: "Price is required for sale, monthly rent is required for rent",
    path: ["price"]
  }
);