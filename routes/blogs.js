const express = require("express");
const router = express.Router();
const Blog=require("../models/blog");
const User=require("../models/user");

////////////////   route to the post form   /////////////////////////

router.get('/new',(req,res)=>{
    //new blank default blog
    res.render("blogs/new",{blog:new Blog()})
})

////////////////  read more route ////////////////////

router.get("/:slug",async (req,res)=>{
    const blog = await Blog.findOne({slug:req.params.slug})
    if(blog == null){
    //if the user not found,render to the home page
         res.redirect("/");
    } 
    else
    res.render("blogs/show",{blog:blog});
})

////////////////// home route ///////////////////////

router.post("/", async (req,res)=>{
    const chars = req.body.tags.split(' ')
    let blog = new Blog({
        title: req.body.title,
        description: req.body.description,
        photo:req.body.photo,
        author:req.body.author,
        userId:req.body.id,
        tags:chars,
        createdAt: new Date(),
     })
     try{
         //this will give us an id for the blog
         console.log(blog.tags);
         blog = await blog.save()
         updateInArray(blog);
         //this will route us to a page for the id of the blog we just created
         res.redirect(`/blogs/${blog.slug}`);
     }catch(e){
         console.log(e)
         //render out the page that we were on if there is an error at one of the fields
         res.render("blogs/new",{blog: blog})
     }
})

///////////////// delete blog route ///////////////////////////

router.delete("/:id",async(req,res)=>{
    await Blog.findByIdAndDelete(req.params.id)
    res.redirect("/");
})

/////////////////// edit form route  ////////////////////////////

router.get("/edit/:id",async(req,res)=>{
    const blog = await Blog.findById(req.params.id)
    res.render("blogs/edit",{blog:blog})
})

/////////////////// edit route ///////////////////////////

router.put("/:id",async(req,res,next)=>{
    console.log(req.blog);
    req.blog=await Blog.findById(req.params.id)
    console.log(req.blog)
    next() 
},edit('edit'))

////////////////// showing search resault route /////////////////////////////////

router.post("/search", async(req,res)=>{
    //searching with author name
    if(req.body.searchAuthor){
        const author = await Blog.find({author:req.body.searchAuthor})
        if(author == null){
            res.redirect("/");
        }
        else{
            res.render("blogs/search",{author:author})    
        }
    }
    //searching with title
    else if(req.body.searchTitle){
        const title = await Blog.find({title:req.body.searchTitle})
        if(title == null){
            res.redirect("/");
        }
        else{
            res.render("blogs/search",{author:title}) 
        }
    }else if(req.body.searchTag){
        const Tag = await Blog.find({tags:req.body.searchTag})
        if(Tag == null){
            res.redirect("/");
        }
        else{
            res.render("blogs/search",{author:Tag}) 
        }
    }       
})
////////////// user profile route ////////////////////

router.get("/indexForUser/:id",async(req,res)=>{
    const data = await Blog.find({userId:req.params.id});
    console.log(data);
    res.render("blogs/indexForUser",{data:data});
})

/////////////////// edit function  /////////////////////
function edit(path){
    return async (req,res)=>{
        let blog =req.blog
        blog.title=req.body.title
        blog.description=req.body.description
        blog.photo=req.body.photo
        blog.author=req.body.author
        try{
            blog = await blog.save()
            res.redirect(`/blogs/${blog.slug}`)
        }catch (e){
            res.render(`blogs/${path}`,{blog:blog})
        }
    }
}

//////////////// adding in user array function ////////////////////////

async function updateInArray(blog){
    let arr=await User.updateOne({_id:blog.userId},{$push : {blogs :blog}});
}

module.exports=router;