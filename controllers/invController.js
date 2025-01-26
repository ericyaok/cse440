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
    let make = data.inv_make
    let model = data.inv_model
    let year = data.inv_year
    res.render("./inventory/detail", {
        title: year + " " + make + " " + model,
        nav,
        card,
    })
}


/* ***************************
 *  Build error 500
 * ************************** */

invCont.buildError = async function (req, res, next) {
    try {
        const vehicle_id = req.params.vehicleId;
        const data = await invModel.getInventoryByVehicleId(vehicle_id);
        if (!data) {
            const error = new Error('Inventory data not found');
            error.status = 404;  // Set status code to 404 (Not Found)
            throw error;
        }

        const card = await utilities.buildDetailView(data);
        let nav = await utilities.getNav();
        let make = data.inv_make;
        let model = data.inv_model;
        let year = data.inv_year;

        res.renderr("./inventory/detail", {
            title: year + " " + make + " " + model,
            nav,
            card,
        });

    } catch (err) {
        console.error(err);
        next(err);
    }
};



module.exports = invCont