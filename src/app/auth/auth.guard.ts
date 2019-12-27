import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import {Observable} from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()

export class AuthGuard implements CanActivate{
    isAuthenticated : boolean;
    constructor(private authService : AuthService,private router : Router){}
    canActivate(route :ActivatedRouteSnapshot,state :RouterStateSnapshot):boolean |Observable<boolean>|Promise<boolean>{
        this.isAuthenticated=this.authService.isAuth();
        this.authService.authStateListener().subscribe(isAuthenticated=>{
            this.isAuthenticated=isAuthenticated;
        })
       
        if(!this.isAuthenticated){
            this.router.navigate(['/auth/login']);
        }
        return this.isAuthenticated;
    
    }
}