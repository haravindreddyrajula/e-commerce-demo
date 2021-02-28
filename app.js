require('dotenv').config()

const mongoose = require("mongoose");
const express = require("express")
const app = express()
const bodyparser = require("body-parser")
const cookieParser = require("cookie-parser")
const cors = require("cors")

//My Routes
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/user")
const categoryRoutes = require("./routes/category")


//DB CONNECTION
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(()=> {
    console.log("DB Connected")
})

//MIDDLE-WARES
app.use(bodyparser.json())
app.use(cookieParser())
app.use(cors())

//MY ROUTES
app.use("/api", authRoutes)
app.use("/api", userRoutes)
app.use("/api", categoryRoutes)

//PORT
const port = process.env.PORT || 8000

//Starting a server
app.listen(port, ()=>{
    console.log(`app is running at ${port}`);
})