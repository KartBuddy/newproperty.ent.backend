import pool from "../../config/db.config.js";

class Inquiry {
    static async create(payload) {
        const { property_id, name, email, phone, message } = payload;
        const query = `
      INSERT INTO inquiries (property_id, name, email, phone, message)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
        const values = [property_id, name, email, phone, message];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error("Failed to create inquiry:", error.message);
            throw error;
        }
    }

    static async getAll() {
        const query = `
      SELECT i.*, p.title as property_title 
      FROM inquiries i
      LEFT JOIN properties p ON i.property_id = p.id
      ORDER BY i.created_at DESC;
    `;
        try {
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error("Failed to fetch inquiries:", error.message);
            throw error;
        }
    }
}

export default Inquiry;
