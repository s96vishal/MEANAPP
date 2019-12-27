import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy{
  userIsAuthenticated = false;
  private authListenerSub : Subscription;
  constructor(private authService : AuthService) { }

  ngOnInit() {
    this.userIsAuthenticated=this.authService.isAuth();
  this.authListenerSub = this.authService.authStateListener().subscribe(isAuthenticated=>{
    this.userIsAuthenticated=isAuthenticated;
  })  
  }
  ngOnDestroy(){
    this.authListenerSub.unsubscribe();
  }
  onLogout(){
    this.authService.logout();
  }
}
