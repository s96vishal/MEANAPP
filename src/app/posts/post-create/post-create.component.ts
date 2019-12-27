import { Component , EventEmitter, Output, OnInit,OnDestroy } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
    selector:'app-post-create',
    templateUrl:'./post-create.component.html',
    styleUrls:['./post-create.component.css']
})
export class PostCreateComponent implements OnInit,OnDestroy{
private mode : string='create';
private id : string;
public post;
isLoading=false;
form : FormGroup;
imagePreview : string;
failedSub : Subscription;


constructor(private postsService : PostsService,private route : ActivatedRoute){}

ngOnInit(){
    //form control
    this.form=new FormGroup({
        'title':new FormControl(null,{validators:[Validators.required,Validators.minLength(5)]}),
        'content':new FormControl(null,{validators:[Validators.required]}),
    })
    //end of form control


    this.route.paramMap.subscribe((paramMap : ParamMap)=>{
        if(paramMap.has('postId')){
            this.mode='edit';
            this.id=paramMap.get('postId');
            this.isLoading=true;
            this.postsService.getPost(this.id).subscribe((postData)=>{
                this.isLoading=false;
                this.post={
                    id:postData._id,
                    title:postData.title,
                    content:postData.content,
                    creator:postData.creator
                 
                }
                this.form.setValue({
                    'title':this.post.title,
                    'content':this.post.content,
                                                              
                })
            });
        }
        else{
            this.mode='create';
            this.id=null;
            
        }
    })

    this.failedSub=this.postsService.failStatus().subscribe(failed=>{
        this.isLoading=false;
    })
    
}

onAddedPost(){
    if(this.form.invalid){
        return;
    }
    if(this.mode=='create'){
        this.isLoading=true;
        this.postsService.addPost(this.form.value.title,this.form.value.content);
    }
    else{
        this.isLoading=true;
        this.postsService.updatePost(
            this.id,
            this.form.value.title,
            this.form.value.content,
            );
    }
    this.form.reset();
}
ngOnDestroy(){
        this.failedSub.unsubscribe();
}
}