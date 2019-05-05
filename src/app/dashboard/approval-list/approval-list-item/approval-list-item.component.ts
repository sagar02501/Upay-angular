import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {MatDialog} from '@angular/material';
import { ActionDialogComponent } from './../../action-dialog/action-dialog.component';

@Component({
  selector: 'app-approval-list-item',
  templateUrl: './approval-list-item.component.html',
  styleUrls: ['./approval-list-item.component.css']
})
export class ApprovalListItemComponent implements OnInit {

  constructor(private dialog: MatDialog) { }
  @Input() approval;
  @Input() approverList;
  @Output() actionOccured: EventEmitter<any> = new EventEmitter();
  openBody = false;

  ngOnInit() {
  }

  onAction() {
    const dialogRef = this.dialog.open(ActionDialogComponent, {data: this.approverList});

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === 2) {
        this.actionOccured.emit({send: true, approvalId: this.approval._id});
      } else if (result) {
        this.actionOccured.emit({send: true, approvalData: this.approval, emailId: result.email, remarks: result.remarks});
      }
    });
  }
}
