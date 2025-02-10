// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const inventoryValidate = require('../utilities/inventory-validation')
const mnValidate = require('../utilities/management-validation')

// Vehicle Management
//router.get("/", utilities.giveAdminRights, utilities.checkLogin, invController.buildManagement);

// Add Classification
router.get("/add-classification",utilities.giveAdminRights, utilities.checkLogin, invController.buildAddClassification);

// Add Inventory
router.get("/add-inventory", utilities.giveAdminRights, utilities.checkLogin, invController.buildAddInventory);

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build detail view of a vehicle(product)
router.get("/detail/:vehicleId", invController.buildByVehicleId);

// Route to build error
router.get("/error/:vehicleId", invController.buildError);

// Route to get inventory in management view
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Edit inventory route
router.get("/edit/:inv_id", utilities.handleErrors(invController.buildEditView));

// Process classification addition
router.post(
  "/add-classification",
  mnValidate.addClassificationRules(),
  mnValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Process inventory addition
router.post(
  "/add-inventory",
  inventoryValidate.inventoryRules(),
  inventoryValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

// Process inventory editing/update
router.post("/update/",
  inventoryValidate.inventoryRules(),
  inventoryValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)



module.exports = router;