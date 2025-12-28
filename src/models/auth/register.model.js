import pool from "../../config/db.config.js";
import bcrypt from "bcrypt";

export const registerModel = async (payload) => {
  const client = await pool.connect();
  try {
    const { name, email, password } = payload;

    const hashPassword = await bcrypt.hash(password, 10);

    const query = `
        INSERT INTO users (
            name,
            email,
            password
        ) VALUES (
            $1, $2, $3
         ) RETURNING id;
    `;

    const values = [name, email, hashPassword];

    const result = await client.query(query, values);
    if (result.rowCount === 0) {
      throw new Error("User registration failed");
    }

    return result.rows[0];
  } catch (error) {
    if (error.code === "23505") {
      throw new Error("Email already exists");
    }

    throw error;
  } finally {
    client.release();
  }
};
