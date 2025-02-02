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


/* ***************************
 *  Build Management View
 * ************************** */
invCont.buildManagement = async function (req, res, next) {

  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: 'Vehicle Management',
    nav,
  })
}

/* ***************************
 *  Build Add-Classification View
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {

  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: 'Add New Classification',
    nav,
  })
}

// Process Add Classification
invCont.addClassification = async function (req, res, next) {

  let nav = await utilities.getNav()
  const classification_name = req.body.classification_name
  console.log('why why')
  console.log(classification_name)
  console.log(req.body)

  const addResult = await invModel.createClassification(
    classification_name
  )

  if (addResult) {
    req.flash(
      "notice",
      `Congratulations, you have added ${classification_name}.`
    )
    res.status(201).render("inventory/management", {
      title: "Add New Classification",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the addition failed.")
    res.status(501).render("inventory/management", {
      title: "Add New Classification",
      nav,
    })
  }
}



module.exports = invCont