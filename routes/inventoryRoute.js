// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const mnValidate = require('../utilities/management-validation')

// Vehicle Management
router.get("/", invController.buildManagement);

// Add Classification
router.get("/add-classification", invController.buildAddClassification);

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build detail view of a vehicle(product)
router.get("/detail/:vehicleId", invController.buildByVehicleId);

// Route to build error
router.get("/error/:vehicleId", invController.buildError);

// Process classification addition
router.post(
  "/add-classification",
  mnValidate.addClassificationRules(),
  mnValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)



module.exports = router;