const path=require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoute=require("./routes/posts");
const userRoute=require("./routes/user");

const app=express();
console.log(process.env.MONGO_ATLAS_PW);
mongoose.connect('mongodb+srv://<USERNAME>:<PASSWORD>@cluster0-p8476.mongodb.net/node-angular?retryWrites=true&w=majority')
        .then(()=>{
            console.log("COnnected Successfully");
        })
        .catch((error)=>{
            console.log(error);
            
            console.log("Connection Failed");
        })

app.use(bodyParser.json());
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','Origin,Content-Type,Accept,X-Requested-With,authorization')
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,PUT,DELETE,OPTIONS');
    next();
});
app.use('/api/user',userRoute); 
app.use('/api/posts',postsRoute);


module.exports=app;
