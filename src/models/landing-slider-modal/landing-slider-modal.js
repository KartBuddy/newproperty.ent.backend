import pool from "../../config/db.config";

class LandingSliderModal {
  static async create(payload) {
    const client = await pool.connect();
    try {
      const { title, description, property_type, images } = payload;

      const query = `
        INSERT INTO landing_slider_content (
          title,
          description,
          property_type,
          images
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;

      const values = [title, description, property_type, images];

      const result = await client.query(query, values);

      if (result.rowCount === 0) {
        throw new Error("Error creating landing slider content");
      }

      return result.rows[0];
    } catch (error) {
      console.error("Failed to create landing slider content:", error.message);
      throw error;
    } finally {
      client.release();
    }
  }

  static async getAll() {
    const client = await pool.connect();
    try {
      const query = `
        SELECT 
          id,
          title,
          description,
          property_type,
          images,
          created_at
        FROM landing_slider_content
        ORDER BY created_at DESC;
      `;

      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error("Failed to fetch landing slider content:", error.message);
      throw error;
    } finally {
      client.release();
    }
  }

  static async update(id, payload) {
    if (!id) {
      throw new Error("Slider ID is required");
    }

    const client = await pool.connect();
    try {
      const fields = [];
      const values = [];
      let index = 1;

      for (const [key, value] of Object.entries(payload)) {
        fields.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }

      if (fields.length === 0) {
        throw new Error("No fields provided to update");
      }

      const query = `
        UPDATE landing_slider_content
        SET ${fields.join(", ")}
        WHERE id = $${index}
        RETURNING *;
      `;

      const result = await client.query(query, [...values, id]);

      if (result.rowCount === 0) {
        throw new Error("Landing slider content not found");
      }

      return result.rows[0];
    } catch (error) {
      console.error("Failed to update landing slider content:", error.message);
      throw error;
    } finally {
      client.release();
    }
  }

  static async delete(id) {
    if (!id) {
      throw new Error("Slider ID is required");
    }

    const client = await pool.connect();
    try {
      const query = `
        DELETE FROM landing_slider_content
        WHERE id = $1
        RETURNING *;
      `;

      const result = await client.query(query, [id]);

      if (result.rowCount === 0) {
        throw new Error("Landing slider content not found");
      }

      return result.rows[0];
    } catch (error) {
      console.error("Failed to delete landing slider content:", error.message);
      throw error;
    } finally {
      client.release();
    }
  }
}

export default LandingSliderModal;
