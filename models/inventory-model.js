const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get a single inventory item by id
 * ************************** */
async function getInventoryByVehicleId(vehicle_id) {
  try {
    const data = await pool.query(
      `SELECT * 
             FROM public.inventory 
             WHERE inv_id = $1`,
      [vehicle_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error("getVehicleById error: " + error);
  }
}

/* ***************************
 *  Add A New Classification
 * ************************** */
async function createClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}


/* ***************************
 *  Get Classification by ID
 * ************************** */
async function getClassificationById(classification_id) {
  try {
    const sql = "SELECT * FROM public.classification WHERE classification_id = $1";
    const result = await pool.query(sql, [classification_id]);

    if (result.rows.length === 0) {
      throw new Error(`No classification found with ID: ${classification_id}`);
    }

    return result.rows[0]; // Return the found classification
  } catch (error) {
    console.error("Database Error:", error.message);
    throw new Error("Failed to retrieve classification");
  }
}

/* ***************************
 *  Update Classification
 * ************************** */
async function updateClassification(classification_id, classification_name) {
  try {
      // Validate input: classification_id must be a number, classification_name must not be empty
      if (!classification_id || isNaN(classification_id) || !classification_name) {
          throw new Error("Invalid input: classification_id must be a number and classification_name must not be empty.");
      }

      const sql = `
          UPDATE classification 
          SET classification_name = $1
          WHERE classification_id = $2
          RETURNING *;
      `;
      
      const result = await pool.query(sql, [classification_name, parseInt(classification_id)]);

      if (result.rowCount === 0) {
          throw new Error(`No classification found with ID: ${classification_id}`);
      }

      return result.rows[0]; // Return the updated classification
  } catch (error) {
      console.error("Database Error:", error.message);
      throw new Error("Failed to update classification.");
  }
}



/* ***************************
 *  Add A New Inventory
 * ************************** */
async function createInventory(classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) {
  try {
    const sql = `
        INSERT INTO inventory 
        (classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) 
        VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
        RETURNING *`;

    const result = await pool.query(sql, [
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    ]);

    return result.rows[0]; // Return the newly created inventory entry
  } catch (error) {
    console.error(error); // Log the error
    return { error: "There was an issue adding the inventory. Please try again." }; // Return a user-friendly error message
  }
}

/* ***************************
*  Update Inventory Data
* ************************** */
async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}



module.exports = { getClassifications, getInventoryByClassificationId, getInventoryByVehicleId, createClassification, createInventory, updateInventory, getClassificationById, updateClassification };