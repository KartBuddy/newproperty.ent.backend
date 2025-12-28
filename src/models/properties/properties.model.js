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
      } = payload;

      // TODO
      //Property image will be added later

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
            owner_contact
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
            $11, $12, $13, $14, $15
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
      ];

      const result = await client.query(query, values);

      if (result.rowCount === 0) {
        throw new Error("Error creating properties.");
      }

      return result.rows;
    } catch (error) {
      console.log("Failed to create properties");
      client.release();
    }
  }

  static async getAll() {
    try {
      const query = `
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
                owner_contact
                created_at
            FROM properties
            ORDER BY created_at DESC;
        `;

      const result = await pool.query(query);
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
      console.log("Failed to fetch property with provided id");
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
}

export default Properties;
