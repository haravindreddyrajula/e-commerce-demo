const express = require("express")
const router = express.Router()

const { getCategoryById, getAllCategories, createCategory, getCategory, updateCategory, removeCategory } = require("../controllers/category")
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth")
const { getUserById } = require("../controllers/user")

//params
router.param("userId", getUserById)
router.param("categoryId", getCategoryById)

//actual routers
router.get("/category/:categoryId", getCategory)
router.get("/categories", getAllCategories)
router.post("/category/create/:userId", isSignedIn, isAuthenticated, isAdmin, createCategory)
router.put("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, updateCategory)
router.delete("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, removeCategory)

module.exports = router