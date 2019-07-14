import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { SettingsService } from '../../service/settings.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from './../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-users-setting',
  templateUrl: './users-setting.component.html',
  styleUrls: ['./users-setting.component.css']
})
export class UsersSettingComponent implements OnInit, OnDestroy {

  isLoading = false;

  private userSub: Subscription;
  users = [];
  private zoneSub: Subscription;
  zones = [];
  constructor(public authService: AuthService, private dialog: MatDialog,
     public settingsService: SettingsService) { }

  ngOnInit() {
    this.authService.getUserList();

    this.userSub = this.authService.getUsersListener().subscribe((res) => {
      this.users = res as any;
      this.isLoading = false;
    });

    this.zoneSub = this.settingsService.getZoneSubjectListener().subscribe((res) => {
      this.zones = res as any;
    });
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password, form.value.zone);
  }

  resetPwd(id) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        header: 'Reset Password',
        message: '',
        resetPwd: true,
        buttonTextPrimary: 'Reset',
        buttonTextSecondary: 'Cancel'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.resetPwd(id, result);
      }
    });
  }

  editUser(id, email, zone) {
    this.authService.editUser(id, email, zone);
  }

  deleteUser(id) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        header: 'Delete',
        message: 'Are you sure you want to delete this user?',
        buttonTextPrimary: 'Delete',
        buttonTextSecondary: 'Cancel'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.deleteUser(id);
      }
    });
  }

  ngOnDestroy() {
    this.zoneSub.unsubscribe();
    this.userSub.unsubscribe();
  }
}
