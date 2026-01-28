const mongoose=require("mongoose");
const Schema=mongoose.Schema;

// force extract plugin function
const plmPkg = require("passport-local-mongoose");
const passportLocalMongoose =
  typeof plmPkg === "function"
    ? plmPkg
    : plmPkg.default || plmPkg.passportLocalMongoose;

const userSchema=new Schema({
    email:{
        type:String,
        required:true
    },
    
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports=User;