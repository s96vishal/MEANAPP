const Post=require('../Models/post');

exports.createPost=(req,res)=>{
    
    const post = new Post({
        title:req.body.title,
        content:req.body.content,     
        creator:req.userData.userId
    });
    // console.log(req.userData);
    // return res.status(200).json({});
    post.save().then((result)=>{
        res.status(201).json({
            message:'Post sent successfully',
            post: {
                id:result._id,
                title:result.title,
                content:result.content,
            }
        })
    }).catch(error=>{
        res.status(201).json({
            message :'You are not Authenticated'
        })
    });
   
    
}

exports.updatePost=(req,res,next)=>{
    const post=new Post({
        _id:req.body.id,
        title:req.body.title,
        content:req.body.content,
        creator : req.userData.userId
    })
    Post.updateOne({_id:req.params.postId,creator : req.userData.userId},post).then((result)=>{
        if(result.n>0){
            res.status(200).json({
                message:'Post updated'
            })
        }else{
            res.status(401).json({
                message:'You are not Authorized '
            })
        }
      
    }).catch(error=>{
        res.status(500).json({
            message : "couldn't update post"
        })
    })
}

exports.deletePost =(req,res,next)=>{
    Post.deleteOne({_id:req.params.id,creator : req.userData.userId}).then(result=>{
        if(result.n >0){
            res.status(200).json({
                message:'Post Deleted'
            })
        }else{
            res.status(401).json({
                message:'You are not Authorized'
            })
        }
    }).catch(error=>{
        res.status(500).json({
            message :'Failed to delete post'
        })
    })
}

exports.getPost=(req,res)=>{
    let fetchedPost;
    const pageSize = +req.query.pagesize;
    const currentPage= +req.query.page;
    const postQuery=Post.find();
    if(pageSize && currentPage){
            postQuery      
                .skip(pageSize *(currentPage-1))
                .limit(pageSize)
    }
   postQuery
        .then((documents)=>{
            fetchedPost=documents;
            return Post.count();        
        })
        .then(count=>{
            res.status(200).json({
                message:'Post fetched successfully',
                posts:fetchedPost,
                maxPost:count
            }) 
        }).catch(error=>{
            res.status(500).json({
                message :'Failed to fetch post'
            })
        })
}

exports.getPostById = (req,res,next)=>{
    Post.findById(req.params.id).then((post)=>{
        if(post){
            console.log(post);
            res.status(200).json(post);
        }
        else{
            res.status(404).json({
                message:'Post Not Found'
            })
        }
    }).catch(error=>{
        res.status(500).json({
            message :'Failed to fetch post'
        })
    })
}