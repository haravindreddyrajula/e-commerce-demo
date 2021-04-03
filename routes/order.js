const express = require("express")
const router = express.Router()

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth")
const { getUserById, pushOrderInPurchaseList } = require("../controllers/user")
const { updateStock } = require("../controllers/product")
const { getOrderById, createOrder, getAllOrders } = require("../controllers/order")

//params
router.param("userId", getUserById)
router.param("orderId", getOrderById)

//Actual Routes
router.post("/order/create/:userId", isSignedIn, isAuthenticated, pushOrderInPurchaseList, updateStock, createOrder)
router.get("/order/all/:userId", isSignedIn, isAuthenticated, isAdmin, getAllOrders)

router.get("/order/status/:userId", isSignedIn, isAuthenticated, isAdmin,)
router.put("/order/:orderId/status/:userId", isSignedIn, isAuthenticated, isAdmin, )

module.exports = router