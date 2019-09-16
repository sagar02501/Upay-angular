import { Component, OnInit } from '@angular/core';
import { ApprovalFormService } from './../service/approval-form.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-get-single-approval',
  templateUrl: './get-single-approval.component.html',
  styleUrls: ['./get-single-approval.component.css']
})
export class GetSingleApprovalComponent implements OnInit {

  token = null;
  approvalId;
  approval;
  approvalCreatedDate;
  trackId;
  timeline;
  err = false;
  private approvalSubscription: Subscription;

  constructor(
    private approvalService: ApprovalFormService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.token = this.route.snapshot.queryParams['token'];
    this.approvalId = this.route.snapshot.queryParams['approvalId'];
    if (this.approvalId) {
      this.getSingleApprovalData();
    }
    this.approvalSubscription = this.approvalService.getApprovalListener().subscribe((res) => {
      if ((res as any).error_message) {
        this.openSnackBar((res as any).error_message, 'failure');
        return;
      }
      if ((res as any).message) {
        this.openSnackBar((res as any).message, 'success');
        this.approval = undefined;
        return;
      }
      this.approval = res;
      console.log(res);
      if (this.approval) {
        this.approvalCreatedDate = new Date(this.approval.date).toLocaleString();
        this.timeline = this.approval.timeline.split('\n');
      }
    });
  }

  openSnackBar(message, type) {
    this.snackBar.open(message, null, {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: type
    });
  }

  getSingleApprovalData() {
    this.approvalService.getSingleApproval(this.approvalId || this.trackId);
  }

  trackById() {
    this.trackId = this.trackId.trim().toUpperCase();
    if (this.trackId) {
      this.getSingleApprovalData();
    }
  }

  openConfirmatinDialog(text, remarks) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        header: 'Confirm',
        message: `Are you sure you want to ${text} this approval?`,
        buttonTextPrimary: 'Yes',
        buttonTextSecondary: 'No'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (text === 'Approve') {
          this.approvalService.approveApproval(this.token, remarks);
        } else if (text === 'Reject') {
          this.approvalService.rejectApproval(this.token, remarks);
        }
      }
    });
  }

}
