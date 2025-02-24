const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}



/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function (data) {
    let grid
    if (data.length > 0) {
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id
                + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + 'details"><img src="' + vehicle.inv_thumbnail
                + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + ' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<hr />'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
                + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
                + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$'
                + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}


/* **************************************
* Format numbers
* ************************************ */
Util.formatToUSD = function (number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(number);
}


Util.formatMileage = function (mileage) {
    return new Intl.NumberFormat('en-US').format(mileage);
}



/* **************************************
* Build the detail view HTML
* ************************************ */
Util.buildDetailView = async function (data) {
    let card
    if (data) {
        card += '<div class="detail-card">'
        card += '<img src="' + data.inv_image + '" alt="Vehicle Image" />';
        card += '<div class="detail-specs">'
        card += '<h2>' + data.inv_make + " " + data.inv_model + ' Details' + '</h2>'
        card += '<p><b>' + 'Price ' + Util.formatToUSD(data.inv_price) + '</b></p>'
        card += '<p>' + '<b>Description </b>' + data.inv_description + '</p>'
        card += '<p>' + '<b>Color </b>' + data.inv_color + '</p>'
        card += '<p>' + '<b>Mileage </b>' + Util.formatMileage(data.inv_miles) + '</p>'
        card += '</div>'
        card += '</div>'

    } else {
        card += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return card
}


// Build classification select input

Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
        '<select name="classification_id" id="classificationList" required value="<%= locals.classification_id %>">'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
        classificationList += '<option value="' + row.classification_id + '"'
        if (
            classification_id != null &&
            row.classification_id == classification_id
        ) {
            classificationList += " selected "
        }
        classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, accountData) {
                if (err) {
                    req.flash("Please log in")
                    res.clearCookie("jwt")
                    return res.redirect("/account/login")
                }
                res.locals.accountData = accountData
                res.locals.loggedin = 1
                next()
            })
    } else {
        res.locals.loggedin = false;
        next()
    }
}



/* ****************************************
* Middleware to authorize admin roles
**************************************** */
Util.giveAdminRights = (req, res, next) => {
    const token = req.cookies.jwt; // Assumes JWT is stored in cookies

    if (!token) {
        req.flash("notice", "Please log in to access this page.");
        return res.redirect("/account/login");
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, accountData) => {
        if (err) {
            req.flash("notice", "Invalid or expired token. Please log in again.");
            res.clearCookie("jwt");
            return res.redirect("/account/login");
        }

        // Check if account type is 'Employee' or 'Admin'
        const { account_type } = accountData;

        if (account_type === "Employee" || account_type === "Admin") {
            res.locals.accountData = accountData; // Pass account data to views
            next(); // User is authorized
        } else {
            req.flash("notice", "You do not have permission to access this page.");
            return res.redirect("/account/login");
        }
    });
}


/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
        next()
    } else {
        req.flash("notice", "Please log in.")
        return res.redirect("/account/login")
    }
}



module.exports = Util






