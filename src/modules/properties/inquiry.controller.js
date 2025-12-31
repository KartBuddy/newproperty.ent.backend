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
}

export default InquiryController;
