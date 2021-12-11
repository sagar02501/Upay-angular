import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthData } from './auth.model';
import { MatSnackBar } from '@angular/material';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url = environment.backendURL + 'api/user/';
  private token;
  private isAuthenticated = false;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener = new Subject<boolean>();
  private userListSubject = new Subject();

  constructor(public http: HttpClient, public router: Router, private snackBar: MatSnackBar) { }

  createUser(email: string, password: string, zone: string, reviewadmin : string) {
    const authData: AuthData = { email: email, password: password, zone: zone, reviewadmin:reviewadmin };
    this.http.post(this.url + 'signup', authData)
      .subscribe((res) => {
        this.openSnackBar((res as any).message, 1);
    },
    (err) => {
      this.openSnackBar(err.error.message, 0);
    }
   );
   setTimeout(() => this.getUserList(), 1000);
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password, zone: '',reviewadmin:'false' };
    this.http.post<{token: string, expiresIn: number, userId: string, zone: string, reviewadmin: string}>(this.url + 'login', authData)
      .subscribe(response => {
        this.token = response.token;
        console.log(this.parseJwt(this.token))
        if (this.token) {
          const expiresIn = response.expiresIn;
          this.setAuthTimer(expiresIn);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresIn * 1000);
          this.saveAuthData(this.token, expirationDate, this.userId);
          this.router.navigate(['/dashboard']);
        }
      },
      error => {
        this.authStatusListener.next(false);
      });
  }

  getUserList() {
    this.http.get(this.url).subscribe((res) => {
      this.userListSubject.next(res);
    },
    (err) => {console.log(err); }
    );
  }

  editUser(id, email, zone, reviewadmin) {
    const data = {id: id, email: email, zone: zone, reviewadmin:reviewadmin};
    this.http.post(this.url + 'edit', data).subscribe((res) => {
      this.openSnackBar((res as any).message, 1);
    },
    (err) => {
      this.openSnackBar(err.error.message, 0);
    }
   );
   setTimeout(() => this.getUserList(), 1000);
  }

  resetPwd(id, pwd) {
    const data = {id: id, password: pwd};
    this.http.post(this.url + 'resetPassword', data).subscribe((res) => {
      this.openSnackBar((res as any).message, 1);
    },
    (err) => {
      this.openSnackBar(err.error.message, 0);
    }
   );
   setTimeout(() => this.getUserList(), 1000);
  }

  deleteUser(id) {
    this.http.delete(this.url + id).subscribe((res) => {
      this.openSnackBar((res as any).message, 1);
    },
    (err) => {
      this.openSnackBar(err.error.message, 0);
    }
   );
   setTimeout(() => this.getUserList(), 1000);
  }

  getToken() {
    return this.token;
  }

  getUserZone() {
    return this.parseJwt(this.token).zone;
  }

  getReviewUserZone() {
    return this.parseJwt(this.token).reviewadmin;
  }

  parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = decodeURIComponent(atob(base64Url).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(base64);
  }

  getUsersListener() {
    return this.userListSubject.asObservable();
  }

  isUserAuthenticated() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  logout() {
    
    this.token = null;
    
    this.isAuthenticated = false;
    // this.authStatusListener.next(false);
    
    this.userId = null;
    
    clearTimeout(this.tokenTimer);
    
    this.clearAuthData();
    
    this.router.navigate(['/login']);
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }

  openSnackBar(message, status) {
    this.snackBar.open(message, null, {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: status ? 'success' : 'failure'
    });
  }
}
