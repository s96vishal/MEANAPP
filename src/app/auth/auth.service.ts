import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl +'/user/';

@Injectable({
    providedIn:'root'
})

export class AuthService{
    private token : string;
    private authTokenListener = new Subject<boolean>();
    private tokenTimer : any;
    private isAuthenticated =false;
    private userId : string;
    constructor(private http : HttpClient,private router : Router){

    }
    isAuth(){
        return this.isAuthenticated;
    }
    getToken(){
    return this.token;
            }

    authStateListener(){
        return this.authTokenListener.asObservable();
    }

    createUser(email : string,password : string){
        const authData : AuthData={email:email,password:password};
      this.http.post(BACKEND_URL+'signup',authData).subscribe(result=>{
          this.router.navigate(['/']);
      },error=>{
          this.authTokenListener.next(false);
      })
                 
    }

    login(email : string, password : string){
        const authData : AuthData={email:email,password:password};
        this.http.post<{token : string,expiresIn : number,userId : string}>(BACKEND_URL+'login',authData)
                 .subscribe(response=>{
                     if(response.token){
                        this.userId=response.userId;
                        this.token =response.token;
                        let expireDuration=response.expiresIn;
                        const now=new Date();
                        const expirationDate=new Date(now.getTime()+expireDuration*1000);
                        this.saveAuthData(response.token,expirationDate,this.userId);
                        this.setAuthTimer(expireDuration);
                        this.isAuthenticated=true
                        this.authTokenListener.next(true);
                        this.router.navigate(['/']);
                     }
                    

                 },error=>{
                     this.authTokenListener.next(false);
                 })
    }
    logout(){
        this.token=null;
        this.authTokenListener.next(false);
        this.clearAuthData();
        this.userId=null;
        this.router.navigate(['/']);
        clearTimeout(this.tokenTimer)
    }

    private saveAuthData(token :string, expiratonDate : Date,userId : string){
        localStorage.setItem('token',token);
        localStorage.setItem('expiration',expiratonDate.toISOString());
        localStorage.setItem('userId',userId)

    }

    private clearAuthData(){
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('userId');
    }
    private getAuthData(){
        const token=localStorage.getItem('token');
        const expiration=localStorage.getItem('expiration');
        const userId=localStorage.getItem('userId');
        if(!token ||!expiration){
            return;
        }
        return {
            token :token,
            expirationDate : new Date(expiration),
            userId : userId
        }
    }

    autoAuthUser(){
        const authInformation = this.getAuthData();
        let now =new Date();
        if(!authInformation){
            return;
        }
        let expiresIn = authInformation.expirationDate.getTime()-now.getTime();

        if(expiresIn>0){
            this.token=authInformation.token;
            this.isAuthenticated=true;
            this.userId=authInformation.userId;
            this.authTokenListener.next(true); 
            this.setAuthTimer(expiresIn/1000);
        }
    }

    setAuthTimer(duration : number){
        this.tokenTimer=setTimeout(()=>{
            this.logout();
        },duration*1000)
    }

    getUserId(){
        return this.userId;
    }
}