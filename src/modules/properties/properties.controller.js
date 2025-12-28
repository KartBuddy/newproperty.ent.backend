import Properties from "../../models/properties/properties.model.js";
import { validateCreateProperty } from "../../utils/validator.js";

class PropertiesController {
  static async create(req, res) {
    const validation = validateCreateProperty.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.errors.map((e) => ({
          field: e.path[0],
          message: e.message,
        })),
      });
    }
    try {
      const properties = await Properties.create(validation.data);

      return res.status(200).json({
        success: true,
        message: "Properties created successfully",
        properties,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error creating properties",
        errors: error.message,
      });
    }
  }
  static async getAll(req, res) {
    try {
      const properties = await Properties.getAll();

      return res.status(201).json({
        success: true,
        message: "Properties fetched successfylly",
        properties,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error Fetching properties",
        errors: error.message,
      });
    }
  }
  static async getSingle(req, res) {
    const { propertyId } = req.params;

    if (!propertyId) {
      return res.status(404).json({
        success: false,
        message: "Failed to get property id",
      });
    }

    try {
      const property = await Properties.getSingle(propertyId);

      return res.status(201).json({
        success: true,
        message: "Got property with provided property id",
        property,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error Fetching properties",
        errors: error.message,
      });
    }
  }
  static async update(req, res) {
    const { propertyId } = req.params;

    if (!propertyId) {
      return res.status(404).json({
        success: false,
        message: "Failed to get property id",
      });
    }

    const payload = req.body;

    try {
      const property = await Properties.update(propertyId, payload);

      return res.status(200).json({
        success: true,
        message: "Property updated successfully",
        property,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error updating properties",
        errors: error.message,
      });
    }
  }
  static async delete(req, res) {
    const { propertyId } = req.params;

    if (!propertyId) {
      return res.status(404).json({
        success: false,
        message: "Failed to get property id",
      });
    }

    try {
      const property = await Properties.delete(propertyId);

      return res.status(200).json({
        success: true,
        message: "Property deleted successfully",
        property,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error deleting properties",
        errors: error.message,
      });
    }
  }
}

export default PropertiesController;
