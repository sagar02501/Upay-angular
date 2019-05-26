import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {MatDialog} from '@angular/material';
import { ActionDialogComponent } from './../../action-dialog/action-dialog.component';
import { AuthService } from 'src/app/service/auth.service';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-approval-list-item',
  templateUrl: './approval-list-item.component.html',
  styleUrls: ['./approval-list-item.component.css']
})
export class ApprovalListItemComponent implements OnInit {

  constructor(private dialog: MatDialog, private authService: AuthService) { }
  @Input() approval;
  @Input() approverList;
  @Output() actionOccured: EventEmitter<any> = new EventEmitter();
  @Input() openBody = false;
  approvalCreatedDate;
  zone;

  ngOnInit() {
    this.approvalCreatedDate = new Date(this.approval.date).toLocaleString();
    const userZone = this.authService.getUserZone();
    if (userZone === 'central') {
      this.zone = 'Zonal';
    } else {
      this.zone = 'Central';
    }
  }

  openTimeline() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        header: 'Approval Timeline',
        message: this.approval.timeline,
        buttonTextPrimary: 'OK',
        buttonTextSecondary: 'Cancel'
      }
    });
  }

  confirmSend() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        header: 'Confirm',
        message: `Are you sure you want to send this approval to ${this.zone}?`,
        buttonTextPrimary: 'Send',
        buttonTextSecondary: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.actionOccured.emit({send: true, approvalId: this.approval._id, zone: this.zone, timeline: this.approval.timeline});
      }
    });
  }

  notifyInitiator() {
    console.log(this.approval.email);
    const dialogRef = this.dialog.open(ActionDialogComponent, {data: {
      approverList: [{email: this.approval.email}],
      title: 'Notify Initiator',
      to: 'Initiator'
    }});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.actionOccured.emit({notify: true, approvalData: this.approval, emailId: result.email, remarks: result.remarks});
      }
    });
  }

  sendToApprover() {
    const dialogRef = this.dialog.open(ActionDialogComponent,
       {data: {
         approverList: this.approverList,
          zone: this.zone,
        title: 'Send to Approver'}});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.actionOccured.emit({send: true, approvalData: this.approval, emailId: result.email, remarks: result.remarks});
      }
    });
  }

  printApproval() {
    const approvalData =
    `<h3>Approval Data</h3>
      <div class="print-approval">
      <div>
      <label>Name</label>
      <span>${this.approval.name}</span>
      </div>
      <div>
      <label>Email</label>
      <span>${this.approval.email}</span>
      </div>
      <div>
      <label>Designation</label>
      <span>${this.approval.designation}</span>
      </div>
      <div>
      <label>Created Date</label>
      <span>${this.approvalCreatedDate}</span>
      </div>
      <div>
      <label>Contact</label>
      <span>${this.approval.contact}</span>
      </div>
      <div>
      <label>Amount</label>
      <span>${this.approval.amount}</span>
      </div>
      <div>
      <label>Zone</label>
      <span>${this.approval.zone}</span>
      </div>
      <div>
      <label>Status</label>
      <span>${this.approval.status}</span>
      </div>
      <div class="row">
      <label>Subject</label>
      <span>${this.approval.subject}</span>
      </div>
      <div class="row">
      <label>Body</label>
      <span>${this.approval.body}</span>
      </div>
      <div class="row">
      <label>Timeline</label>
      <span>${this.approval.timeline}</span>
      </div>
    </div>`;

    const style = `<style>
    html {
      font-size: 16px !important;
    }
    .print-approval {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
    }
    .print-approval > div {
      display: flex;
      width: 80%;
      justify-content: space-between;
      align-items: center;
    }
    .print-approval > div + div {
      margin-top: 10px;
    }
    .print-approval > .row {
      display: flex;
      width: 80%;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
    }
    .print-approval label {
      font-weight: 700;
    }
    h3 {
      text-align: center;
    }
      </style>`;

    const win = window.open('', '', 'height=700,width=700');

    win.document.write('<html><head>');
    win.document.write('<title>Approval Data</title>');
    win.document.write(style);
    win.document.write('</head>');
    win.document.write('<body>');
    win.document.write(approvalData);
    win.document.write('</body></html>');

    win.document.close();

    win.print();
  }
}
