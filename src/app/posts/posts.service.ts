import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl +'/posts/';

@Injectable({
    providedIn:'root'
})


export class PostsService{
    constructor(private http : HttpClient,private router: Router){}
    isFailed=new Subject<any>();
    private posts : Post[]=[];
    private postUpdated=new Subject<{posts:Post[];postCount : number}>();

    failStatus(){
        return this.isFailed.asObservable();
    }


    getPosts(pageSize,currentPage){
        const queryParams=`?pagesize=${pageSize}&page=${currentPage}`;

      this.http.get<{message :string, posts : [{_id:string,title:string,content:string,creator : string}],maxPost:number}>(BACKEND_URL+queryParams)
      .pipe(map((postData)=>{
          return {posts :postData.posts.map(posts=>{
              return {
                  title:posts.title,
                  content:posts.content,
                  id:posts._id,
                  creator:posts.creator};
          }),postCount : postData.maxPost}
      }))
      .subscribe((transformedData)=>{
        this.posts=transformedData.posts
        this.postUpdated.next({posts : [...this.posts],postCount : transformedData.postCount});
      },error=>{
          this.isFailed.next(false);
      })
    }


    getPost(postId : string){
        return this.http.get<{_id:string,title:string,content:string,creator : string}>(BACKEND_URL+postId);
    }
    getPostUpdateListener(){
        return this.postUpdated.asObservable();
    }
    addPost(title :string,content:string){
       
        const postData :Post = {
            id:null,
            title:title,
            content:content,
            creator : null
        }

      

        this.http.post<{message : string,post:Post}>(BACKEND_URL,postData)
        .subscribe((resData)=>{
            this.router.navigate(['/']);
        },error=>{
            this.isFailed.next(false);
        })
    }
    updatePost(id:string,title:string,content:string){
        let postData :Post ;
            postData= {
                id:id,
                title:title,
                content:content,
                creator : null
            }
        
        
        this.http.put(BACKEND_URL+id,postData).subscribe(()=>{
            this.router.navigate(['/']);
        },error=>{
            this.isFailed.next(false);
        })
    }
    deletePost(postId : string){
        return this.http.delete(BACKEND_URL+postId); 
    }
}