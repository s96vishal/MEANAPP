const express=require("express");
const Post=require('../Models/post');
const route=express.Router();

const checkAuth=require('../middleware/check-auth');
const postController = require('../controller/posts');

route.post('',checkAuth,postController.createPost);
route.put('/:postId',checkAuth,postController.updatePost);


route.get('/:id',postController.getPostById)

route.get('',postController.getPost)



route.delete('/:id',checkAuth,postController.deletePost);


module.exports=route;