const express = require("express")
const router = express.Router()

const { getProductById, createProduct, getProduct, photo, deleteProduct, updateProduct, getAllProducts, getUniqueCategories } = require("../controllers/product")
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth")
const { getUserById } = require("../controllers/user")

//params
router.param("userId", getUserById)
router.param("productId", getProductById)

//actual routers
router.post("/product/create/:userId", isSignedIn, isAuthenticated, isAdmin, createProduct)
router.get("/product/:productId", getProduct)
router.get("/product/photo/:productId", photo)
router.put("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, updateProduct)
router.delete("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, deleteProduct )
router.get("/products", getAllProducts)
router.get("/products/categories", getUniqueCategories)

module.exports = router