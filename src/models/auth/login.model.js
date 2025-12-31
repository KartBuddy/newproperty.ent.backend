import pool from "../../config/db.config.js";

class LoginModel {
  static async login(email, password) {
    const client = await pool.connect();
    try {
      const query = `
          SELECT 
              id,
              name,
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

      const isPasswordValid = password === user.password;

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
      throw error;
    } finally {
      client.release();
    }
  }
}

export default LoginModel;
