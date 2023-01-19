const mongoose = require('mongoose');

const userSchema=mongoose.Schema({
    userName:String,
    email:String,
    password:String,
    blogs:[]
})
//type:mongoose.Schema.Types.ObjectId,ref:"Blog"
const user=mongoose.model('User',userSchema);

module.exports=user;