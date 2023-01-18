const express = require("express");
const router = express.Router();
const Blog=require("../models/blog");

router.get('/new',(req,res)=>{
    //new blank default blog
    res.render("blogs/new",{blog:new Blog()})
})

router.get("/:slug",async (req,res)=>{
    const blog = await Blog.findOne({slug:req.params.slug})
    if(blog == null){
    //if the user not found,render to the home page
         res.redirect("/");
    } 
    else
    res.render("blogs/show",{blog:blog});
})

router.post("/", async (req,res)=>{
    let blog = new Blog({
        title: req.body.title,
        description: req.body.description,
        photo:req.body.photo,
        author:req.body.author,
        createdAt: new Date(),
     })
     try{
         //this will give us an id for the blog
         blog = await blog.save()
         //this will route us to a page for the id of the blog we just created
         res.redirect(`/blogs/${blog.slug}`);
     }catch(e){
         console.log(e)
         //render out the page that we were on if there is an error at one of the fields
         res.render("blogs/new",{blog: blog})
     }
})

//deleting a blog from the button
router.delete("/:id",async(req,res)=>{
    await Blog.findByIdAndDelete(req.params.id)
    res.redirect("/");
})

//edit a blog
router.get("/edit/:id",async(req,res)=>{
    const blog = await Blog.findById(req.params.id)
    res.render("blogs/edit",{blog:blog})
})

///////////////////////////////////////////////////////////////////
router.put("/:id",async(req,res,next)=>{
    console.log(req.blog);
    req.blog=await Blog.findById(req.params.id)
    console.log(req.blog)
    next() 
},edit('edit'))
//////////////////////////////////////////////////////////////////

router.post("/search", async(req,res)=>{
    //searching with author name
    if(req.body.searchAuthor){
        const author = await Blog.find({author:req.body.searchAuthor})
        console.log(author);
        if(author == null){
            console.log(author)
            res.redirect("/");
        }
        else{
            console.log("author else")
            res.render("blogs/search",{author:author})    
        }
    }
    //searching with title
    else if(req.body.searchTitle){
        const title = await Blog.find({title:req.body.searchTitle})
        console.log(title)
        if(title == null){
            console.log("title in if")
            res.redirect("/");
        }
        else{
            res.render("blogs/search",{author:title}) 
            console.log("title")
        }
    }       
})


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



module.exports=router;