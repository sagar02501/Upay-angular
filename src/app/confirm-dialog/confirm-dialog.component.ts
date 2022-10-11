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
  isSendTofileApproval
  approverList;
  approval;
  awardPodata;
  isWithOutFund;
  isAuditBtn;
  ngOnInit() {
    this.header = this.data.header || '';
    this.message = this.data.message || '';
    this.htmlBody = this.data.htmlBody || '';
    this.isSendPO = this.data.isSendPO || false;
    this.approval = this.data.approval || '';
    this.awardPodata = this.data.awardPodata || '';
    this.approverList = this.data.approverList || [];
    this.buttonTextPrimary = this.data.buttonTextPrimary || 'Yes';
    this.buttonTextSecondary = this.data.buttonTextSecondary || 'No';
    this.resetPwd = this.data.resetPwd || false;
    this.timeline = this.data.timeline || false;
    this.isAuditBtn = this.data.isAuditBtn || false;
    this.isSendTofileApproval = this.data.isSendTofileApproval || false;
    console.log("Accounr No :" + this.approval.account_no);
    console.log("Vendor Address:" + this.awardPodata.vendor_addr);
    console.log("Audit :" + this.approval.isAudit);

  }
  openMailPreview() {
    const win = window.open('', '', 'height=800,width=700');

    win.document.write('<html><head>');
    win.document.write('<title>Upay|Purchase Order Preview- You can close this window</title>');
    win.document.write('</head>');
    win.document.write('<body>');
    win.document.write(this.data.htmlBody);

    win.document.write('</body></html>');

    setTimeout(function () {
      win.document.close();
      //win.print();
    }, 500);
  }
  file: File | null
  onImagePicked(event: Event) {
    this.file = (event.target as HTMLInputElement).files[0];
  }
}
