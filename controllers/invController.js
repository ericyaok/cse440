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
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: 'Vehicle Management',
    nav,
    classificationSelect,
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
    errors: null,
  })
}

/* ***************************
 *  Build Add-Inventory View
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {

  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: 'Add New Vehicle',
    nav,
    classificationSelect,
    errors: null,
  })
}


/* ***************************
 *  Build Inventry Edit View
 * ************************** */
invCont.buildEditView = async function (req, res, next) {

  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByVehicleId(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

// Process Add Classification
invCont.addClassification = async function (req, res, next) {

  let nav = await utilities.getNav()
  const classification_name = req.body.classification_name

  const addResult = await invModel.createClassification(
    classification_name
  )

  if (addResult) {
    req.flash(
      "notice",
      `Congratulations, you have added ${classification_name}.`
    )
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
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

// Process Add Inventory
invCont.addInventory = async function (req, res) {

  let nav = await utilities.getNav()
  const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
  const classificationSelect = await utilities.buildClassificationList()

  const addInventory = await invModel.createInventory(
    classification_id,
    inv_make, inv_model,
    inv_year, inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  )

  if (addInventory) {
    req.flash(
      "notice",
      `Congratulations, you have added ${inv_make + " " + inv_model}.`
    )
    res.status(201).render("inventory/management", {
      title: "Add New Classification",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the addition failed.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationSelect,
    })
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
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
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
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
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}



/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}



module.exports = invCont