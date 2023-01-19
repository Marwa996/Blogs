const express = require('express');
const route = express.Router();
const userController= require('../controllers/userController');
const path=require('path');
const fs=require('fs');

route.use(express.urlencoded({extended:true}));

route.post("/register",userController.SignUp);

route.get('/profile/:id',async function(req,res)
{
    let data=req.params.id;
    res.render("blogs/new",{text: data})
}
)

route.get('/',async function(req,res)
{
    console.log("dfgdd");
    res.sendFile(path.join(__dirname,'../views/user/user.html'));
}
)

route.get('/login',async function(req,res)
{
    
    res.sendFile(path.join(__dirname,'../views/user/login.html'));
}
)

route.post('/profile',userController.Login);



module.exports=route;