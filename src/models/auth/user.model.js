import pool from "../../config/db.config.js";

class User {
    static async updateProfile(userId, { name, email }) {
        const client = await pool.connect();
        try {
            const query = `
        UPDATE users 
        SET name = $1, email = $2 
        WHERE id = $3 
        RETURNING id, name, email;
      `;
            const result = await client.query(query, [name, email, userId]);
            if (result.rowCount === 0) {
                throw new Error("User not found");
            }
            return result.rows[0];
        } finally {
            client.release();
        }
    }

    static async updatePassword(userId, newPassword) {
        const client = await pool.connect();
        try {
            const query = `
        UPDATE users 
        SET password = $1 
        WHERE id = $2;
      `;
            await client.query(query, [newPassword, userId]);
            return true;
        } finally {
            client.release();
        }
    }

    static async findById(id) {
        const client = await pool.connect();
        try {
            const result = await client.query("SELECT * FROM users WHERE id = $1", [id]);
            return result.rows[0];
        } finally {
            client.release();
        }
    }
}

export default User;
