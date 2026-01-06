import Properties from "../../models/properties/properties.model.js";
import { validateCreateProperty } from "../../utils/validator.js";

class PropertiesController {
  static async create(req, res) {
    const payload = { ...req.body };

    if (req.files) {
      payload.images = req.files.map(f => f.path.replace(/\\/g, "/"));
    }

    const validation = validateCreateProperty.safeParse(payload);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.errors.map(e => ({
          field: e.path[0],
          message: e.message,
        })),
      });
    }

    const property = await Properties.create(validation.data, {
      source: "admin",
    });

    res.status(201).json({ success: true, property });
  }

  static async requestProperty(req, res) {
    const payload = { ...req.body };

    if (req.files) {
      payload.images = req.files.map(f => f.path.replace(/\\/g, "/"));
    }

    const validation = validateCreateProperty.safeParse(payload);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.errors,
      });
    }

    const property = await Properties.create(validation.data, {
      source: "client",
    });

    res.status(201).json({
      success: true,
      message: "Property submitted for approval",
      property,
    });
  }

  static async getAll(req, res) {
    const isAdmin = !!req.user;
    const properties = await Properties.getAll(req.query, isAdmin);
    res.json({ success: true, properties });
  }

  static async getAllAdmin(req, res) {
    try {
      const properties = await Properties.getAllAdmin(req.query);

      res.status(200).json({
        success: true,
        properties,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch admin properties",
      });
    }
  }


  static async getSingle(req, res) {
    const property = await Properties.getSingle(req.params.propertyId);
    res.json({ success: true, property });
  }

  static async getPending(req, res) {
    const properties = await Properties.getPending();
    res.json({ success: true, properties });
  }

  static async updateApproval(req, res) {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ success: false });
    }

    const property = await Properties.updateApproval(
      req.params.propertyId,
      status
    );

    res.json({
      success: true,
      message: `Property ${status}`,
      property,
    });
  }

  static async update(req, res) {
    const payload = { ...req.body };
    if (req.files?.length) {
      payload.images = req.files.map(f => f.path.replace(/\\/g, "/"));
    }

    const property = await Properties.update(
      req.params.propertyId,
      payload
    );

    res.json({ success: true, property });
  }

  static async delete(req, res) {
    const property = await Properties.delete(req.params.propertyId);
    res.json({ success: true, property });
  }

  static async toggleLike(req, res) {
    const { increment } = req.body;
    const result = await Properties.toggleLike(
      req.params.propertyId,
      increment
    );
    res.json({ success: true, likes: result.likes });
  }
}

export default PropertiesController;
