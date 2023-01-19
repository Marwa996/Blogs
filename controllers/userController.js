const User = require('../models/user');

// async function SignUp(username,email,pass)
// {
//     let data=await User.create(username,email,pass)
//     return data;
// }

let SignUp=async(req,res)=>{
    let user= new User({
        userName:req.body.username,
        password:req.body.pass,
        email:req.body.email
       
    
    })
  try{
    user = await user.save()

    res.redirect("/user/login")
  }
  catch(e){
    console.log(e)
    res.redirect("/user/register");
  }
    }

    // let Login=async (req,res)=>{
    //     let data =await user.find({userName:req.body.username}).select({userName:1,email:1,blog:1});
    // if (!user.find({userName:req.body.username})) return res.status(404).send("not a user");

    //  res.send(data);
        
    // }

    let Login=async (req,res)=>{

      let data = await User.findOne({userName:req.body.username})

      if(data==null){
        return res.status(404).redirect("/user/login");
      }
      else{
        return res.redirect(`/user/profile/${data._id}`);
      }
    }

// async function Login(username){
//     let data=await user.find({userName:username});

//     return data;
// }


module.exports={SignUp,Login}