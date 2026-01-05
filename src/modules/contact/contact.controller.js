import ContactModel from "../../models/contact/contact.model.js";

class ContactController {
    static async submitContact(req, res) {
        try {
            const { name, email, subject, message, phone } = req.body;

            if (!name || !email || !message) {
                return res.status(400).json({
                    status: "error",
                    message: "Please provide name, email and message",
                });
            }

            const submission = await ContactModel.create({
                name,
                email,
                subject: subject || "No Subject",
                message,
                phone: phone || "Not Provided",
            });

            res.status(201).json({
                status: "success",
                message: "Your message has been sent successfully! Our team will contact you soon.",
                data: submission,
            });
        } catch (error) {
            console.error("Contact submission error:", error.message);
            res.status(500).json({
                status: "error",
                message: "Internal server error. Please try again later.",
            });
        }
    }

    static async getAllSubmissions(req, res) {
        try {
            const submissions = await ContactModel.getAll();
            res.status(200).json({
                status: "success",
                data: submissions,
            });
        } catch (error) {
            console.error("Get submissions error:", error.message);
            res.status(500).json({
                status: "error",
                message: "Internal server error",
            });
        }
    }

    static async getSubmissionById(req, res) {
        try {
            const { id } = req.params;
            const submission = await ContactModel.getById(id);

            if (!submission) {
                return res.status(404).json({
                    status: "error",
                    message: "Submission not found",
                });
            }

            res.status(200).json({
                status: "success",
                data: submission,
            });
        } catch (error) {
            console.error("Get submission by ID error:", error.message);
            res.status(500).json({
                status: "error",
                message: "Internal server error",
            });
        }
    }

    static async deleteSubmission(req, res) {
        try {
            const { id } = req.params;
            const deleted = await ContactModel.delete(id);

            if (!deleted) {
                return res.status(404).json({
                    status: "error",
                    message: "Submission not found",
                });
            }

            res.status(200).json({
                status: "success",
                message: "Submission deleted successfully",
            });
        } catch (error) {
            console.error("Delete submission error:", error.message);
            res.status(500).json({
                status: "error",
                message: "Internal server error",
            });
        }
    }
}

export default ContactController;
