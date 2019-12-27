const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');

const User=require('../Models/user');


exports.createUser=(req,res,next)=>{
    bcrypt.hash(req.body.password,10)
    .then(hash=>{
        user=new User({
            email:req.body.email,
            password:hash
        });
        user.save()
        .then(result=>{
            res.status(200).json({
                message:'User created Successfully',
                result : result
            })
        })
        .catch(err=>{
            res.status(500).json({
                message : "Email Address already Exists!!!"
            })
        })
    })
}

exports.userLogin=(req,res,next)=>{
    let fetchedUser;
    User.findOne({email:req.body.email}).then(user=>{
        if(!user){
            return res.status(401).json({
                message:'Email address does not Exist'
            })
        }
        fetchedUser=user;
        return bcrypt.compare(req.body.password,user.password)
    })
    .then(result=>{
        if(!result){
            return res.status(401).json({
                message:'Invalid Password'
            });
        }
        const token=jwt.sign({email:req.body.email,userId:fetchedUser._id},
            "secret-this-should-be-longer",
            {expiresIn:"1h"}
            )
            res.status(200).json({
                token:token,
                expiresIn : 3600,
                userId : fetchedUser.id
            })
    })
    .catch(err=>{
        return res.status(401).json({
            message : 'Invalid Username or Password'
        })
    })
}