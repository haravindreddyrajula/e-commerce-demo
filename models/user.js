var mongoose = require("mongoose");
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');

var userSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 32
    },

    lastName:{
        type: String,
        maxlength: 32,
        trim: true
    },

    email:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    userinfo: {
        type: String,
        trim: true
    },

    //TODO 
    encry_password: {
        type : String,
        required: true
    },

    salt: String,
    role: {
        type: Number,
        default: 0
    },
    purchases:{
        type: Array,
        default:[]
    }
},
{timestamps: true}
);

  userSchema.virtual('password')
    .set(function(password){
        this._password = password  //using "_" makes private variable
        this.salt = uuidv1();
        this.encry_password = this.securePassword(password);
    })
    .get(function(){
        return this._password
    })

  userSchema.method = {
    
    authenticate: function(plainpassword){
        return this.securePassword(plainpassword) === this.encry_password
    },

    securePassword: function(plainpassword){
          if(!plainpassword) return "";
          try{
              return crypto.createHmac('sha256', this.salt)
              .update(plainpassword)
              .digest('hex')

          } catch(err){
              return "";
          }
      }
  }

  module.exports = mongoose.model("User", userSchema)