const Product = require("../models/product")
const formidable = require("formidable")
const _ = require("lodash")
const fs = require("fs")

exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
        .populate("category")
        .exec((err, item) => {
        if(err){
            return res.status(400).json({
                error: "Product not found in DB"
            })
        }
        req.product = item
        next()
    }) 
}

exports.createProduct = (req, res) => {

    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error: "Problem with the image"
            })
        }

        //fields Destructuring
        const {name, description, price, category, stock} = fields

        //restrictions on fields
        //validtor similar to used in auth routes could be used
        if ( !name || !description || !price || !category || !stock){
            return res.status(400).json({
                error: "few fields are missing"
            })
        }

        let product = new Product(fields)

        //file handling
        if(file.photo){
            if (file.photo.size > 6000000){
                return res.status(400).json({
                    error: "File is too big!"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }

        //console.log(product)

        //saving product to DB
        product.save((err, item) => {
            if (err){
                res.status(400).json({
                    error: "saving the product to DB failed!"
                })
            }
            res.json(item)
        })
    })
}

exports.getProduct = (req, res) => {
    /*  As the image loading takes time, we are undefining it in json 
        and using middleware we are loading the photo and 
        parallely here json response would be done
    */
    req.product.photo = undefined
    return res.json(req.product)
}

// middleware to help "getProduct"
exports.photo = (req, res, next) => {
    if (req.product.photo.data){
        res.set("Content-Type", req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next()
}

exports.deleteProduct = (req, res) => {
    let product = req.product
    product.remove((err, deletedProduct) => {
        if (err){
            return res.status(400).json({
                error: "Failed to delete the product"
            })
        }

        res.json({
            message: "Deletion is Success", deletedProduct
        })
    })
}

exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error: "Problem with the image"
            })
        }

        //fields Destructuring
        const {name, description, price, category, stock} = fields

        //updation code
        let product = req.product
        product = _.extend(product, fields)

        //file handling
        if(file.photo){
            if (file.photo.size > 6000000){
                return res.status(400).json({
                    error: "File is too big!"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }

        //console.log(product)

        //saving product to DB
        product.save((err, item) => {
            if (err){
                res.status(400).json({
                    error: "updating the product to DB failed!"
                })
            }
            res.json(item)
        })
    })
}

exports.getAllProducts = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id"

    Product.find()
        .select("-photo")  //"-" means except
        .populate("category")
        .sort([[sortBy, "asc"]])
        .limit(limit)
        .exec((err, products) => {
        if (err){
            return res.status(400).json({
                error: "Products are empty"
            })
        }
        res.json(products)
    })
}

exports.getUniqueCategories = (req, res) => {
    Product.distinct("category", {}, (err, category) => {
        if (err){
            return res.status(400).json({
                error: "Category section is empty"
            })
        }
        res.json(category)
    })
} 

exports.updateStock = (req, res, next) => {

    let myOperations = req.body.order.products.map(prod => {
        return {
            updateOne: {
                filter: {_id: prod._id},
                update: {$inc: {stock: -prod.count, sold: +prod.count}}
            }
        }
    })

    Product.bulkWrite(myOperations, {}, (err, products) => {
        if (err){
            return res.status(400).json({
                error: "Bulk Operation failed"
            })
        }
        next()
    })

}

