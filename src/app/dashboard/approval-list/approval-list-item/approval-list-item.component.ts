import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {MatDialog} from '@angular/material';
import { ActionDialogComponent } from './../../action-dialog/action-dialog.component';
import { AuthService } from 'src/app/service/auth.service';

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

  onAction() {
    const dialogRef = this.dialog.open(ActionDialogComponent, {data: {approverList: this.approverList, zone: this.zone}});

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === 2) {
        this.actionOccured.emit({send: true, approvalId: this.approval._id, zone: this.zone});
      } else if (result) {
        this.actionOccured.emit({send: true, approvalData: this.approval, emailId: result.email, remarks: result.remarks});
      }
    });
  }
}
