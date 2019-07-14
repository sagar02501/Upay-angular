import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
  header;
  message;
  buttonTextPrimary;
  buttonTextSecondary;
  resetPwd;

  ngOnInit() {
    this.header = this.data.header || 'Confirm';
    this.message = this.data.message || 'Default';
    this.buttonTextPrimary = this.data.buttonTextPrimary || 'Yes';
    this.buttonTextSecondary = this.data.buttonTextSecondary || 'No';
    this.resetPwd = this.data.resetPwd || false;
    console.log(this.resetPwd);
  }

}
