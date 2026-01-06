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

    static async getByPropertyId(propertyId) {
        if (!propertyId) throw new Error("Property id is required");

        const query = `
        SELECT 
            i.*,
            p.title AS property_title
        FROM inquiries i
        LEFT JOIN properties p ON i.property_id = p.id
        WHERE i.property_id = $1
        ORDER BY i.created_at DESC;
    `;

        const result = await pool.query(query, [propertyId]);
        return result.rows;
    }

    static async getById(id) {
        const query = `
        SELECT 
            i.*,
            p.title AS property_title
        FROM inquiries i
        LEFT JOIN properties p ON i.property_id = p.id
        WHERE i.id = $1
        LIMIT 1;
    `;

        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    }

    static async delete(id) {
        const result = await pool.query(
            `DELETE FROM inquiries WHERE id = $1 RETURNING *`,
            [id]
        );
        return result.rows[0] || null;
    }
}

export default Inquiry;
