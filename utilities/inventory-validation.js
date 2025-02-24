const utilities = require("../utilities/")
const { body, validationResult } = require("express-validator")
const validate = {}




/* **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
    return [

        // Classification ID is required
        body('classification_id')
            .notEmpty()
            .withMessage('Please select a classification.'),

        // Make is required and must be a string
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Make is required."),

        // Model is required and must be a string
        body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Model is required."),

        // Year is required and must be between 1900 and 2099
        body("inv_year")
            .trim()
            .notEmpty()
            .isInt({ min: 1900, max: 2099 })
            .withMessage("Year must be between 1900 and 2099."),

        // Description is required
        body("inv_description")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Description is required."),

        // Image path is required and must be a valid URL
        body("inv_image")
            .trim()
            .notEmpty()
            .withMessage("Image path must be a valid URL."),

        // Thumbnail path is required and must be a valid URL
        body("inv_thumbnail")
            .trim()
            .notEmpty()
            .withMessage("Thumbnail path must be a valid URL."),

        // Price is required and must be a positive number
        body("inv_price")
            .trim()
            .notEmpty()
            .isFloat({ min: 0 })
            .withMessage("Price must be a positive number."),

        // Miles is required and must be a non-negative integer
        body("inv_miles")
            .trim()
            .notEmpty()
            .isInt({ min: 0 })
            .withMessage("Miles must be a non-negative integer."),

        // Color is required
        body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Color is required."),
    ]
};


/* ******************************
 * Check data and return errors or continue to inventory addition
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body;
    const classificationSelect = utilities.buildClassificationList()
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("inventory/add-inventory", {
            errors,
            title: "Add New Vehicle",
            nav,
            classificationSelect,
            classification_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
        });
        return;
    }
    next();
};

/* ******************************
 * Check data and return errors to edit view
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, inv_id } = req.body;
    const classificationSelect = utilities.buildClassificationList()
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("inventory/edit-inventory", {
            errors,
            title: "Edit Inventory",
            nav,
            classificationSelect,
            classification_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            inv_id,
        });
        return;
    }
    next();
};


module.exports = validate