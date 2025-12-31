import Dashboard from "../../models/dashboard/dashboard.model.js";

class DashboardController {
    static async getStats(req, res) {
        try {
            const stats = await Dashboard.getStats();
            return res.status(200).json({
                success: true,
                stats
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch dashboard statistics",
                error: error.message
            });
        }
    }
}

export default DashboardController;
