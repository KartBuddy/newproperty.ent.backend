import pool from "../../config/db.config.js";
import bcrypt from "bcrypt";

export const loginModel = async (payload) => {
  const client = await pool.connect();
  try {
    const { email, password } = payload;

    const query = `
        SELECT 
            id,
            email,
            password
        FROM users
        WHERE email = $1
        LIMIT 1;      
    `;
    const result = await client.query(query, [email]);

    if (result.rowCount === 0) {
      throw new Error("User not found");
    }

    const user = result.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  } catch (error) {
    console.error("Failed to login: ", error);
    client.release();
  }
};
