import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-action-dialog',
  templateUrl: './action-dialog.component.html',
  styleUrls: ['./action-dialog.component.css']
})
export class ActionDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  approverList;
  title;
  to;
  isFundTransfer;
  isNew = true;
  placeholder;
  modeList = ["NEFT", "RTGS", "IMPS", "UPI"];
  expCodes = ["Center", "Zonal", "Central"];
  types = [{
    name: "Salary/Stipened",
    value: "salary"
  },
  {
    name: "Vendor Bill",
    value: "vendor bill"
  },
  {
    name: "Utility Bill",
    value: "utility bill"
  },
  {
    name: "Refund",
    value: "refund"
  }];

  ngOnInit() {
    console.log(this.data.approverList);
    this.approverList = this.data.approverList || [];
    this.title = this.data.title || '';
    this.to = this.data.to || 'Approver';
    this.isFundTransfer = this.data.isFundTransfer || false;
    if (this.data.to) {
      this.placeholder = 'Remarks';
    } else {
      this.placeholder = 'Remarks/DOP Clause';
    }
  }
  openPaymentDashboard() {
    window.open('https://x.razorpay.com/contacts', '_blank')
  }

}
