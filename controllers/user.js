const User = require("../models/user")
const Order = require("../models/order")

exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user){
            return res.status(400).json({
                error: "No user was found in DB"
            })
        }
        
        req.profile = user
        next()
    })
}

exports.getUser = (req, res) => {
    //req.profile would give the sensitive info as well like salt and encrypassword values.
    
    /*
    below is Beginner way but not ok
    req.profile.salt = "" 
    */

    req.profile.salt = undefined
    req.profile.encry_password = undefined
    req.profile.createdAt = undefined
    req.profile.updatedAt = undefined

    return res.json(req.profile)
}

/*           commenting this due to security reasons

exports.getAllUsers = (req, res) => {
    User.find().exec((err, users) => {
        if (err || !users){
            return res.status(400).json({
                error: "Users data not found in DB"
            })
        }

        res.json(users)
    })
}

*/

exports.updateUser = (req, res) => {
    User.findByIdAndUpdate(
        {_id: req.profile._id}, // from url
        {$set: req.body},       // frontend
        {new: true, useFindAndModify: false}, //doc necessity
        (err, user) => {
            if(err){
                return  res.status(400).json({
                    error: "updating the user is unsuccessful"
                })
            }

            user.salt = undefined
            user.encry_password = undefined
            user.createdAt = undefined
            user.updatedAt = undefined

            res.json(user)


        }
    )
}

exports.userPurchaseList = (req, res) => {
    Order.find({user: req.profile._id})
         .populate("user", "_id name")
         .exec((err, order) => {
             if (err){
                 return res.status(400).json({
                     error: "No order in this account"
                 })
             }

             return res.json(order)
         })
}

exports.pushOrderInPurchaseList = (req, res, next) => {
    
    let tempPurchases = []
    //all the info will get from frontend req
    req.body.order.products.forEach(product => {
        tempPurchases.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,                  //this two fields will get with req outof model
            transaction_id: req.body.order.transaction_id
        })
    });

    //Storing in DB.
    User.findOneAndUpdate(
        //finding the user
        {_id: User.profile._id}, 

        //updating and using push instead set because push is used for array
        {$push: {purchases: tempPurchases}},
        
        //By "new" we are requesting to send the updated userdetails
        {new: true},

        (err, purchase) => {
            if(err){
                return res.status(400).json({
                    error: "Unable to save purchase list"
                })
            }
            next()
        }
    )
}