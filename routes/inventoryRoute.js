// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build detail view of a vehicle(product)
router.get("/detail/:vehicleId", invController.buildByVehicleId);

// Route to build error
router.get("/error/:vehicleId", invController.buildError);

module.exports = router;