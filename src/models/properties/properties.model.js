import pool from "../../config/db.config.js";

class Properties {
  static async create(payload, options = { source: "admin" }) {
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

      const approval_status =
        options.source === "client" ? "pending" : "approved";

      const created_by = options.source;

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
          images,
          approval_status,
          created_by
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
          $11,$12,$13,$14,$15,$16,$17,$18
        )
        RETURNING *;
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
        images ? JSON.stringify(images) : null,
        approval_status,
        created_by,
      ];

      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async getAll(filters = {}, isAdmin = false) {
    let query = `SELECT * FROM properties`;
    const values = [];
    const conditions = [];

    if (!isAdmin) {
      conditions.push(`approval_status = 'approved'`);
    }

    if (filters.property_type && filters.property_type !== "all") {
      values.push(filters.property_type);
      conditions.push(`property_type = $${values.length}`);
    }

    if (filters.status && filters.status !== "all") {
      values.push(filters.status);
      conditions.push(`status = $${values.length}`);
    }

    if (filters.city) {
      values.push(`%${filters.city}%`);
      conditions.push(`city ILIKE $${values.length}`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += ` ORDER BY created_at DESC`;

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async getAllAdmin(filters = {}) {
    let query = `
    SELECT *
    FROM properties
  `;

    const values = [];
    const conditions = [];

    if (filters.approval_status) {
      conditions.push(`approval_status = $${values.length + 1}`);
      values.push(filters.approval_status);
    }

    if (filters.created_by) {
      conditions.push(`created_by = $${values.length + 1}`);
      values.push(filters.created_by);
    }

    if (conditions.length) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY created_at DESC";

    const result = await pool.query(query, values);
    return result.rows;
  }


  static async getSingle(propertyId) {
    const result = await pool.query(
      `SELECT * FROM properties WHERE id = $1 LIMIT 1`,
      [propertyId]
    );

    if (!result.rows.length) {
      throw new Error("Property not found");
    }

    return result.rows[0];
  }

  static async getPending() {
    const result = await pool.query(`
      SELECT * FROM properties
      WHERE approval_status = 'pending'
      ORDER BY created_at DESC
    `);
    return result.rows;
  }

  static async update(propertyId, payload) {
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

    if (!fields.length) throw new Error("No valid fields provided");

    const values = fields.map((f) =>
      f === "images" ? JSON.stringify(payload[f]) : payload[f]
    );

    const setClause = fields
      .map((f, i) => `${f} = $${i + 1}`)
      .join(", ");

    const result = await pool.query(
      `UPDATE properties SET ${setClause} WHERE id = $${fields.length + 1
      } RETURNING *`,
      [...values, propertyId]
    );

    return result.rows[0];
  }

  static async updateApproval(propertyId, status) {
    const result = await pool.query(
      `UPDATE properties
       SET approval_status = $1
       WHERE id = $2
       RETURNING *`,
      [status, propertyId]
    );
    return result.rows[0];
  }

  static async delete(propertyId) {
    const result = await pool.query(
      `DELETE FROM properties WHERE id = $1 RETURNING id`,
      [propertyId]
    );
    return result.rows[0];
  }

  static async toggleLike(propertyId, increment = true) {
    const result = await pool.query(
      `UPDATE properties
       SET likes = likes + $1
       WHERE id = $2
       RETURNING likes`,
      [increment ? 1 : -1, propertyId]
    );
    return result.rows[0];
  }
}

export default Properties;
