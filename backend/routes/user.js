const express=require("express");
const route=express.Router();

const userController = require('../controller/user');



route.post('/signup',userController.createUser);
route.post('/login',userController.userLogin);

module.exports = route;