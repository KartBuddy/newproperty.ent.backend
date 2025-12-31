import pool from "../../config/db.config.js";

class ContactModel {
    static async create(payload) {
        const client = await pool.connect();
        try {
            const { name, email, subject, message, phone } = payload;
            const query = `
        INSERT INTO contact_submissions (name, email, subject, message, phone)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;
            const values = [name, email, subject, message, phone];
            const result = await client.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error("Error in ContactModel.create:", error.message);
            throw error;
        } finally {
            client.release();
        }
    }

    static async getAll() {
        const client = await pool.connect();
        try {
            const query = "SELECT * FROM contact_submissions ORDER BY created_at DESC";
            const result = await client.query(query);
            return result.rows;
        } catch (error) {
            console.error("Error in ContactModel.getAll:", error.message);
            throw error;
        } finally {
            client.release();
        }
    }

    static async getById(id) {
        const client = await pool.connect();
        try {
            const query = "SELECT * FROM contact_submissions WHERE id = $1";
            const result = await client.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            console.error("Error in ContactModel.getById:", error.message);
            throw error;
        } finally {
            client.release();
        }
    }

    static async delete(id) {
        const client = await pool.connect();
        try {
            const query = "DELETE FROM contact_submissions WHERE id = $1 RETURNING *";
            const result = await client.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            console.error("Error in ContactModel.delete:", error.message);
            throw error;
        } finally {
            client.release();
        }
    }
}

export default ContactModel;
