import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
    templateUrl:'./login.component.html',
    styleUrls:['./login.component.css']
})

export class LoginComponent implements OnInit,OnDestroy{
isLoading=false;
authStatusSub : Subscription;
constructor(private authService : AuthService){}

ngOnInit(){
    this.authStatusSub=this.authService.authStateListener().subscribe(result=>{
        this.isLoading=false;
    })
}

onSubmit(loginData : NgForm){
if(loginData.invalid){
    return;
}
this.authService.login(loginData.value.email,loginData.value.password);
}

ngOnDestroy(){
    this.authStatusSub.unsubscribe();
}
}