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
async function createClassification(classification_name){
    try {
      const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
      return await pool.query(sql, [classification_name])
    } catch (error) {
      return error.message
    }
  }





module.exports = { getClassifications, getInventoryByClassificationId, getInventoryByVehicleId, createClassification };