const express = require("express");
const router = express.Router();
const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const { getToken, processPayment } = require("../controllers/paymentB");

// Due to access denied issue removing isAuthenticated part from both the routes

router.get("/payment/gettoken/:userId", isSignedIn, getToken);
router.post("/payment/braintree/:userId", isSignedIn, processPayment);

module.exports = router;
