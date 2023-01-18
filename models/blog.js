const mongoose = require("mongoose");
const slugify = require ("slugify");

const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    photo:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:new Date()
    },
    slug:{
        type:String,
        required:true,
        //cause we want to use it in the URL so it have to be unique
        unique:true
    },
    author:{
        type:String,
        required:true
    },
    // tags:{
    //     type:Array
    // }
})

//to make the slug automatically calculated every time we're going to save our blog
//we're gonna add some validation and before attributes
//this function is gonna run right before we do validation on our blog every time
//we save,update,delete .. in hthis function we're gonna make a slug from the title
blogSchema.pre('validate',function(next){
    if(this.title){
        this.slug = slugify(this.title, {
            //lowerCase
            lower:true,
            //git rid of any of the characters that don't fit in our URL (: for example)
            strict:true
        })
    }
    //this function takes a middleware so we have to call it or it will cause an error
    next()
})


module.exports = mongoose.model('Blog',blogSchema);