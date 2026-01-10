import pool from "../../config/db.config.js";

class Properties {
  static async create(payload, options = { source: "admin" }) {
    const client = await pool.connect();
    try {
      const {
        title,
        description,
        property_category,
        property_type,
        transaction_type,
        status,
        price,
        monthly_rent,
        security_deposit,
        area_sqft,
        usable_carpet_area,
        rera_carpet_area,
        bedrooms,
        bathrooms,
        kitchens,
        halls,
        bhk_type,
        parking,
        flat_office_no,
        wing_block_tower,
        floor_no,
        building_society_name,
        plot_cts_survey_no,
        street_road_name,
        landmark,
        local_area_sector,
        area_locality,
        address,
        city,
        district,
        state,
        pincode,
        truck_access_available,
        furnishing_status,
        furnishings,
        core_building_features,
        convenience_services,
        fitness_wellness,
        families_recreation,
        social_leisure_spaces,
        commercial_amenities,
        owner_name,
        owner_contact,
        images,
      } = payload;

      const approval_status = options.source === "client" ? "pending" : "approved";
      const created_by = options.source;

      const query = `
        INSERT INTO properties (
          title, description, property_category, property_type, transaction_type,
          status, price, monthly_rent, security_deposit,
          area_sqft, usable_carpet_area, rera_carpet_area,
          bedrooms, bathrooms, kitchens, halls, bhk_type, parking,
          flat_office_no, wing_block_tower, floor_no, building_society_name, plot_cts_survey_no,
          street_road_name, landmark, local_area_sector, area_locality,
          address, city, district, state, pincode,
          truck_access_available, furnishing_status, furnishings,
          core_building_features, convenience_services, fitness_wellness,
          families_recreation, social_leisure_spaces, commercial_amenities,
          owner_name, owner_contact, images,
          approval_status, created_by
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
          $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
          $31, $32, $33, $34, $35, $36, $37, $38, $39, $40,
          $41, $42, $43, $44, $45, $46
        )
        RETURNING *;
      `;

      const values = [
        title,
        description || null,
        property_category,
        property_type,
        transaction_type,
        status || 'available',
        price || null,
        monthly_rent || null,
        security_deposit || null,
        area_sqft,
        usable_carpet_area || null,
        rera_carpet_area || null,
        bedrooms || null,
        bathrooms || null,
        kitchens || null,
        halls || null,
        bhk_type || null,
        parking || false,
        flat_office_no || null,
        wing_block_tower || null,
        floor_no || null,
        building_society_name || null,
        plot_cts_survey_no || null,
        street_road_name || null,
        landmark || null,
        local_area_sector || null,
        area_locality || null,
        address,
        city,
        district,
        state,
        pincode,
        truck_access_available || false,
        furnishing_status || null,
        furnishings ? JSON.stringify(furnishings) : '{}',
        core_building_features ? JSON.stringify(core_building_features) : '{}',
        convenience_services ? JSON.stringify(convenience_services) : '{}',
        fitness_wellness ? JSON.stringify(fitness_wellness) : '{}',
        families_recreation ? JSON.stringify(families_recreation) : '{}',
        social_leisure_spaces ? JSON.stringify(social_leisure_spaces) : '{}',
        commercial_amenities ? JSON.stringify(commercial_amenities) : '{}',
        owner_name,
        owner_contact,
        images ? JSON.stringify(images) : null,
        approval_status,
        created_by
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

    if (filters.property_category && filters.property_category !== "all") {
      values.push(filters.property_category);
      conditions.push(`property_category = $${values.length}`);
    }

    if (filters.property_type && filters.property_type !== "all") {
      values.push(filters.property_type);
      conditions.push(`property_type = $${values.length}`);
    }

    if (filters.transaction_type && filters.transaction_type !== "all") {
      values.push(filters.transaction_type);
      conditions.push(`transaction_type = $${values.length}`);
    }

    if (filters.status && filters.status !== "all") {
      values.push(filters.status);
      conditions.push(`status = $${values.length}`);
    }

    if (filters.city) {
      values.push(`%${filters.city}%`);
      conditions.push(`city ILIKE $${values.length}`);
    }

    if (filters.district) {
      values.push(`%${filters.district}%`);
      conditions.push(`district ILIKE $${values.length}`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += ` ORDER BY created_at DESC`;

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async getAllAdmin(filters = {}) {
    let query = `SELECT * FROM properties`;
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
      "title", "description", "property_category", "property_type", "transaction_type",
      "status", "price", "monthly_rent", "security_deposit",
      "area_sqft", "usable_carpet_area", "rera_carpet_area",
      "bedrooms", "bathrooms", "kitchens", "halls", "bhk_type", "parking",
      "flat_office_no", "wing_block_tower", "floor_no", "building_society_name", "plot_cts_survey_no",
      "street_road_name", "landmark", "local_area_sector", "area_locality",
      "address", "city", "district", "state", "pincode",
      "truck_access_available", "furnishing_status", "furnishings",
      "core_building_features", "convenience_services", "fitness_wellness",
      "families_recreation", "social_leisure_spaces", "commercial_amenities",
      "owner_name", "owner_contact", "images"
    ];

    const fields = Object.keys(payload).filter((key) =>
      allowedFields.includes(key)
    );

    if (!fields.length) throw new Error("No valid fields provided");

    const values = fields.map((f) => {
      if (["images", "furnishings", "core_building_features", "convenience_services", 
           "fitness_wellness", "families_recreation", "social_leisure_spaces", 
           "commercial_amenities"].includes(f)) {
        return Array.isArray(payload[f]) ? JSON.stringify(payload[f]) : payload[f];
      }
      if ((f === "bedrooms" || f === "bathrooms" || f === "kitchens" || f === "halls") && payload[f] === "") {
        return null;
      }
      return payload[f];
    });

    const setClause = fields
      .map((f, i) => `${f} = $${i + 1}`)
      .join(", ");

    const result = await pool.query(
      `UPDATE properties SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`,
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