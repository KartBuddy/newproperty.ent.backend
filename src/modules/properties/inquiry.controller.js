import Inquiry from "../../models/properties/inquiry.model.js";

class InquiryController {
    static async create(req, res) {
        try {
            const { property_id, name, email, phone, message } = req.body;

            if (!property_id || !name || !email) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields: property_id, name, and email are required."
                });
            }

            const inquiry = await Inquiry.create({ property_id, name, email, phone, message });

            return res.status(201).json({
                success: true,
                message: "Inquiry submitted successfully",
                inquiry
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to submit inquiry",
                error: error.message
            });
        }
    }

    static async getAll(req, res) {
        try {
            const inquiries = await Inquiry.getAll();
            return res.status(200).json({
                success: true,
                inquiries
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch inquiries",
                error: error.message
            });
        }
    }

    static async getByPropertyId(req, res) {
        try {
            const { propertyId } = req.params;
            if (!propertyId) return res.status(400).json({ success: false, message: "propertyId required" });
            const inquiries = await Inquiry.getByPropertyId(propertyId);
            return res.status(200).json({ success: true, inquiries });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Failed to fetch inquiries", error: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const inquiry = await Inquiry.getById(id);
            if (!inquiry) return res.status(404).json({ success: false, message: "Not found" });
            return res.status(200).json({ success: true, inquiry });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Failed to fetch inquiry", error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            const removed = await Inquiry.delete(id);
            if (!removed) return res.status(404).json({ success: false, message: "Not found" });
            return res.status(200).json({ success: true, message: "Deleted", inquiry: removed });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Failed to delete", error: error.message });
        }
    }
}

export default InquiryController;
