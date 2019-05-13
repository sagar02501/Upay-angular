import { Component, OnInit } from '@angular/core';
import { AuthService } from './../service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private authService: AuthService) { }
  showSettings = false;

  ngOnInit() {
    const userZone = this.authService.getUserZone();
    if (userZone === 'admin') {
      this.showSettings = true;
    }
  }

  onLogout() {
    this.authService.logout();
  }
}
