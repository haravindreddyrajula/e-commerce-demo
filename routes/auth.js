var express = require("express")
var router = express.Router()

const {check, validationResult} = require("express-validator") //data validation
const {signout, signup, signin, isSignedIn} = require("../controllers/auth")

router.post(
    "/signup", 
    [ // validating the signup the body (backend restrictions)
        check("name", "name should be at least 3 character long").isLength({min: 3}),
        check("email", "email is required").isEmail(),
        check("password", "password should be at least 6 character long").isLength({min : 6})
    ], 
    signup
)

router.post(
    "/signin", 
    [ // validating the signup the body (backend restrictions)
        check("email", "email is required").isEmail(),
        check("password", "password field is required").isLength({min : 1})
    ], 
    signin
)

router.get("/signout", signout)

//postman: header[authorization: Bearer "token string without inverted commas"]
router.get("/testroute", isSignedIn, (req, res) => {
    // res.send("testing protected route success")
    res.json(req.auth)
})

module.exports = router