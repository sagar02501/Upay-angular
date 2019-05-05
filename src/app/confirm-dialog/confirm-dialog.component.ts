import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
  header = 'Confirm';
  message = 'Default';
  buttonTextPrimary = 'Yes';
  buttonTextSecondary = 'No';

  ngOnInit() {
    this.data.header ? this.header = this.data.header : '';
    this.data.message ? this.message = this.data.message : '';
    this.data.buttonTextPrimary ? this.buttonTextPrimary = this.data.buttonTextPrimary : '';
    this.data.buttonTextSecondary ? this.buttonTextSecondary = this.data.buttonTextSecondary: '';
  }

}
