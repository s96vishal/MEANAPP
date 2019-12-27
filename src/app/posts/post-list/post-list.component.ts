import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import {Subscription} from'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit,OnDestroy{
  userIsAuthenticated =false;
  sub : Subscription;
  authStateSub : Subscription;
  failedSub : Subscription;
  userId : string;
  constructor(private postsService : PostsService, private authService : AuthService){}
 posts : Post[]=[];
  isLoading=false;
  totalPosts=0;
  postPerPage=2;
  currentPage=1;
  pageSizeOption=[1,2,5,10];



 ngOnInit(){
   this.isLoading=true
  this.postsService.getPosts(this.postPerPage,1);
  this.userId=this.authService.getUserId();
  this.sub=this.postsService.getPostUpdateListener().subscribe((postData:{posts:Post[],postCount:number})=>{
    this.isLoading=false;
    this.totalPosts=postData.postCount;
  this.posts=postData.posts;
});
  this.userIsAuthenticated=this.authService.isAuth();
  this.authStateSub=this.authService.authStateListener().subscribe(isAuthenticated=>{
      this.userIsAuthenticated=isAuthenticated;
      this.userId=this.authService.getUserId();
  
  })
  this.failedSub=this.postsService.failStatus().subscribe(failed=>{
    this.isLoading=false;
  })
  }
  ngOnDestroy(){
    this.sub.unsubscribe();
    this.authStateSub.unsubscribe();
  }

  onDelete(postId : string){
    this.postsService.deletePost(postId).subscribe(()=>{
      this.postsService.getPosts(this.postPerPage,this.currentPage);
    });
  }

  onChangedPage(pageData : PageEvent){
    this.isLoading=false;
    this.postPerPage=pageData.pageSize;
    this.currentPage=pageData.pageIndex+1;
    this.postsService.getPosts(this.postPerPage,this.currentPage);
  }
}
