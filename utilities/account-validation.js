const utilities = require("../utilities/")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")
const validate = {}


/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registationRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."), // on error this message is sent.

        // lastname is required and must be string
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a last name."), // on error this message is sent.

        // valid email is required and cannot already exist in the database
        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail() // refer to validator.js docs
            .withMessage("A valid email is required.")
            .custom(async (account_email, { req }) => {
                const accountId = req.body.account_id; // Get the account ID from the form or request body
                console.log('body', req.body)

                const existingAccount = await accountModel.getAccountByEmail(account_email);

                console.log('existing email', existingAccount)
                console.log(!(existingAccount.account_id != accountId))

                if (existingAccount) {
                    // Check if the existing email belongs to a different user
                    if (!(existingAccount.account_id != accountId)) {
                        throw new Error("This email exists already. Choose a different one.");
                    }
                }
            }),

        // password is required and must be strong password
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
    ]
}

/* ******************************
* Check data and return errors or continue to registration
* ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}

/* ******************************
* Check account edit data and return errors or proceed to update
* ***************************** */
validate.checkUpdateUserData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/edit-info", {
            errors,
            title: "Edit Account Details",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}

/* ******************************
* Check password update
* ***************************** */
validate.checkUpdatePassword = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email, account_password } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/edit-info", {
            errors,
            title: "Edit Account Details",
            nav,
            account_firstname,
            account_lastname,
            account_email,
            account_password,
        })
        return
    }
    next()
}






/*  **********************************
  *  Login Data Validation Rules
  * ********************************* */
validate.loginRules = () => {
    return [
        // a valid email is required
        body("account_email")
            .trim()
            .isEmail()
            .withMessage("Please enter a valid email address.")
            .normalizeEmail(),

        // Password is required 
        body("account_password")
            .trim()
            .notEmpty()
            .withMessage("Password is required."),
    ];
};


/* ******************************
* Check login data and provide errors
* ***************************** */
validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body;
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        return res.render("account/login", {
            errors,
            title: "Login",
            nav,
            account_email,
        });
    }

    next()
};


module.exports = validate
