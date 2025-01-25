const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}


/* ***************************
 *  Build inventory by detail view
 * ************************** */

invCont.buildByVehicleId = async function (req, res, next) {
    const vehicle_id = req.params.vehicleId
    const data = await invModel.getInventoryByVehicleId(vehicle_id)
    const card = await utilities.buildDetailView(data)
    let nav = await utilities.getNav()
    let model = data.inv_make
    let make = data.inv_model
    res.render("./inventory/detail", {
        title: make + " " + model,
        nav,
        card,
    })


}

module.exports = invCont