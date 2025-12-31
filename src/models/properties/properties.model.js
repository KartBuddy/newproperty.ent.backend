import pool from "../../config/db.config.js";

class Properties {
  static async create(payload) {
    const client = await pool.connect();
    try {
      const {
        title,
        description,
        property_type,
        status,
        price,
        area_sqft,
        bedrooms,
        bathrooms,
        parking,
        address,
        city,
        state,
        pincode,
        owner_name,
        owner_contact,
        images,
      } = payload;

      const query = `
        INSERT INTO properties (
            title,
            description,
            property_type,
            status,
            price,
            area_sqft,
            bedrooms,
            bathrooms,
            parking,
            address,
            city,
            state,
            pincode,
            owner_name,
            owner_contact,
            images
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
            $11, $12, $13, $14, $15, $16
         ) RETURNING *;
      `;

      const values = [
        title,
        description,
        property_type,
        status,
        price,
        area_sqft,
        bedrooms,
        bathrooms,
        parking,
        address,
        city,
        state,
        pincode,
        owner_name,
        owner_contact,
        images,
      ];

      const result = await client.query(query, values);

      if (result.rowCount === 0) {
        throw new Error("Error creating properties.");
      }

      return result.rows[0];
    } catch (error) {
      console.error("Failed to create properties:", error.message);
      throw error;
    } finally {
      client.release();
    }
  }

  static async getAll(filters = {}) {
    try {
      let query = `
            SELECT 
                id,
                title,
                description,
                property_type,
                status,
                price,
                area_sqft,
                bedrooms,
                bathrooms,
                parking,
                address,
                city,
                state,
                pincode,
                owner_name,
                owner_contact,
                images,
                likes,
                created_at
            FROM properties
      `;

      const values = [];
      const conditions = [];

      if (filters.property_type && filters.property_type !== 'all') {
        conditions.push(`property_type = $${values.length + 1}`);
        values.push(filters.property_type);
      }

      if (filters.status && filters.status !== 'all') {
        conditions.push(`status = $${values.length + 1}`);
        values.push(filters.status);
      }

      if (filters.city) {
        conditions.push(`city ILIKE $${values.length + 1}`);
        values.push(`%${filters.city}%`);
      }

      if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(" AND ");
      }

      query += ` ORDER BY created_at DESC;`;

      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.log("Failed to fetch properties: ", error.message);
      throw error;
    }
  }

  static async getSingle(propertyId) {
    if (!propertyId) {
      throw new Error("Property id is required.");
    }

    const client = await pool.connect();

    try {
      const query = `
            SELECT * FROM properties
            WHERE id = $1
            LIMIT 1;
        `;

      const result = await client.query(query, [propertyId]);

      if (result.rowCount === 0) {
        throw new Error("Property not found");
      }

      return result.rows[0];
    } catch (error) {
      console.error("Failed to fetch property:", error.message);
      throw error;
    } finally {
      client.release();
    }
  }

  static async update(propertyId, payload) {
    if (!propertyId) {
      throw new Error("Property id is required");
    }

    const client = await pool.connect();

    try {
      const allowedFields = [
        "title",
        "description",
        "property_type",
        "status",
        "price",
        "area_sqft",
        "bedrooms",
        "bathrooms",
        "parking",
        "address",
        "city",
        "state",
        "pincode",
        "owner_name",
        "owner_contact",
        "images",
      ];

      const fields = Object.keys(payload).filter((key) =>
        allowedFields.includes(key)
      );

      if (fields.length === 0) {
        throw new Error("No valid fields provided to update");
      }

      const values = fields.map((field) => payload[field]);

      const setQuery = fields
        .map((field, index) => `${field} = $${index + 1}`)
        .join(", ");

      const query = `
        UPDATE properties
        SET ${setQuery}
        WHERE id = $${fields.length + 1}
        RETURNING *;
      `;

      const result = await client.query(query, [...values, propertyId]);

      if (result.rowCount === 0) {
        throw new Error("Property not found");
      }

      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async delete(propertyId) {
    const client = await pool.connect();
    if (!propertyId) {
      throw new Error("Property id is required");
    }

    try {
      const query = `
            DELETE FROM properties
            WHERE id = $1
            RETURNING id;
        `;

      const result = await client.query(query, [propertyId]);

      if (result.rowCount === 0) {
        throw new Error("Property not found");
      }

      return result.rows[0];
    } catch (error) {
      console.log(error);
      client.release();
      throw error;
    }
  }

  static async toggleLike(propertyId, increment = true) {
    const client = await pool.connect();
    try {
      const query = `
        UPDATE properties 
        SET likes = likes + $1 
        WHERE id = $2 
        RETURNING likes;
      `;
      const result = await client.query(query, [increment ? 1 : -1, propertyId]);
      if (result.rowCount === 0) {
        throw new Error("Property not found");
      }
      return result.rows[0];
    } finally {
      client.release();
    }
  }
}

export default Properties;
