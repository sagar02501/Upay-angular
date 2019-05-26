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
    this.header = this.data.header || '';
    this.message = this.data.message || '';
    this.buttonTextPrimary = this.data.buttonTextPrimary || '';
    this.buttonTextSecondary = this.data.buttonTextSecondary || '';
  }

}
