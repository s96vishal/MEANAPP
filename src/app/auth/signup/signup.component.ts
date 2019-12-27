import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';


@Component({
    templateUrl:'./signup.component.html',
    styleUrls:['./signup.component.css']
})

export class SignupComponent implements OnInit,OnDestroy{
    constructor(private authService : AuthService){}
isLoading=false;
userCreated ;
authStatusSub :Subscription;
successMessage : string;
errorMessage : string;

ngOnInit(){
this.authStatusSub=this.authService.authStateListener().subscribe(result=>{
    this.isLoading=false;
})
}

onSignup(signupData : NgForm){
    if(signupData.invalid){
        return
    }
    this.isLoading=true;
this.authService.createUser(signupData.value.email,signupData.value.password);
}

ngOnDestroy(){
this.authStatusSub.unsubscribe();
}
}