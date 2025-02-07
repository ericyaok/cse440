const utilities = require("../utilities/")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")
const validate = {}



/*  **********************************
  *  Add Classification Validation Rules
  * ********************************* */
validate.addClassificationRules = () => {
    return [
        // a valid classification text is required
        body('classification_name')
        .trim() // Remove leading & trailing spaces
        .notEmpty().withMessage('Classification name is required')
        .matches(/^[A-Za-z0-9]+$/).withMessage('Name cannot contain a space or special characters')
        .isLength({ min: 1, max: 50 }).withMessage('Name must be between 1 and 50 characters') // Optional length restriction
    ];
};


/* ******************************
* Check classification  data and provide errors
* ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body;
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        return res.render("inventory/add-classification", {
            errors,
            title: "Add New Classification",
            nav,
            classification_name, 
        });
    }
    
    next()
};


module.exports = validate
