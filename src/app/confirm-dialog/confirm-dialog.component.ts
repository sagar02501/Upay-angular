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
  timeline;
  htmlBody;
  isSendPO;
  approverList;
  ngOnInit() {
    this.header = this.data.header || '';
    this.message = this.data.message || '';
    this.htmlBody = this.data.htmlBody || '';
    this.isSendPO = this.data.isSendPO || false;
    this.approverList = this.data.approverList || [];
    this.buttonTextPrimary = this.data.buttonTextPrimary || 'Yes';
    this.buttonTextSecondary = this.data.buttonTextSecondary || 'No';
    this.resetPwd = this.data.resetPwd || false;
    this.timeline = this.data.timeline || false;
  }
  openMailPreview(){
    const win = window.open('', '', 'height=700,width=700');

    win.document.write('<html><head>');
    win.document.write('<title>Upay|Purchase Order Preview- You can close this window</title>');
    win.document.write('</head>');
    win.document.write('<body>');
    win.document.write(this.data.htmlBody);
    
    win.document.write('</body></html>');
    
    setTimeout(function() {
      win.document.close();
      //win.print();
    }, 500);
  }

}
