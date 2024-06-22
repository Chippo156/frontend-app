import { Component, Injectable, Input, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { TokenService } from '../../service/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  adminComponent: string = 'orders';
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router
  ) {}
  ngOnInit(): void {}
  showDashBoard(adminComponent: string) {
    this.adminComponent = adminComponent;
  }
  logout() {
    this.userService.removeUserResponseFromLocalStorage();
    this.tokenService.removeToken();
    this.router.navigate(['/login']);
  }
  
}
