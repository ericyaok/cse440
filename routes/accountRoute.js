const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const invController = require("../controllers/invController")
const regValidate = require('../utilities/account-validation')

// Route to account management after login
router.get("/", utilities.handleErrors(accountController.buildLoggedInView));
// Route to edit account info
router.get("/edit-info/:account_id", utilities.handleErrors(accountController.buildAccountEdit));
// Route to handle account
router.get("/login", utilities.handleErrors(accountController.buildLogin));
// Registration/Sign-up route
router.get("/register", utilities.handleErrors(accountController.buildRegister));
// Inventory management view
router.get("/management", utilities.giveAdminRights, utilities.checkLogin, utilities.handleErrors(invController.buildManagement));

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Process account edit(firstname, lastname, email)
 router.post(
  "/edit-info",
  regValidate.registationRules(),
  regValidate.checkUpdateUserData,
  utilities.handleErrors(accountController.updateAccountInfo)
) 

// Process account edit(password)
router.post(
  "/update-password",
  regValidate.registationRules(),
  regValidate.checkUpdatePassword,
  utilities.handleErrors(accountController.updateAccountPassword)
) 

// Logout Route
router.get('/logout', (req, res) => {
  res.clearCookie('jwt');  // Clears the JWT cookie
  req.flash('You have been logged out successfully!');
  res.redirect('/account/login');  // Redirect to the login page or homepage
});



module.exports = router;