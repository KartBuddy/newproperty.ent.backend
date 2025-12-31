import pool from "../../config/db.config.js";

class Dashboard {
    static async getStats() {
        const client = await pool.connect();
        try {
            // 1. Total Properties
            const propertiesResult = await client.query("SELECT COUNT(*) FROM properties");
            const totalProperties = parseInt(propertiesResult.rows[0].count);

            // 2. Total Inquiries
            const inquiriesResult = await client.query("SELECT COUNT(*) FROM inquiries");
            const totalInquiries = parseInt(inquiriesResult.rows[0].count);

            // 3. Total Likes
            const likesResult = await client.query("SELECT SUM(likes) FROM properties");
            const totalLikes = parseInt(likesResult.rows[0].sum || 0);

            // 4. Status Distribution
            const statusResult = await client.query(`
        SELECT status, COUNT(*) 
        FROM properties 
        GROUP BY status
      `);

            // 5. Recent Inquiries
            const recentInquiriesResult = await client.query(`
        SELECT i.*, p.title as property_title 
        FROM inquiries i
        LEFT JOIN properties p ON i.property_id = p.id
        ORDER BY i.created_at DESC
        LIMIT 5;
      `);

            return {
                totalProperties,
                totalInquiries,
                totalLikes,
                statusBreakdown: statusResult.rows,
                recentInquiries: recentInquiriesResult.rows
            };
        } catch (error) {
            console.error("Dashboard stats error:", error.message);
            throw error;
        } finally {
            client.release();
        }
    }
}

export default Dashboard;
