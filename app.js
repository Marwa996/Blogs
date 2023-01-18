const express = require("express");
const app = express();
const blogRouter= require("./routes/blogs");
const mongoose = require("mongoose");
const Blog =require("./models/blog");
//method override so that we can use route.delete method
const methodOverride = require('method-override')
var bodyParser = require('body-parser')

//we can access all of the different parameters from our
//blog form inside of our blog route by post method

app.use(express.urlencoded({extended:false}));

app.use(bodyParser.json());
//database connection
mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/blogsFinal",{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("Database Connected")
}).catch((err)=>{
    console.log("connection failed")
});

//writing the views using ejs and the view engine is gonna convert this ejs code to HTML
app.set("view engine","ejs")
//when ever we set _method in any form, this is gonna to override the method
app.use(methodOverride('_method'))

app.get("/", async(req,res)=>{
    const blogs = await Blog.find().sort({
        createdAt: 'desc'
    })
    //passing objects to the index.ejs
    res.render("blogs/index",{blogs:blogs});
});

app.use("/blogs",blogRouter)

app.listen(9000, () => {
    console.log("Server is running at port 9000");
});