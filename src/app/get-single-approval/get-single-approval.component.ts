import { Component, OnInit } from '@angular/core';
import { ApprovalFormService } from './../service/approval-form.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SettingsService } from './../service/settings.service';
import { AuthService } from './../service/auth.service';
import { ActionDialogComponent } from '../dashboard/action-dialog/action-dialog.component';


@Component({
  selector: 'app-get-single-approval',
  templateUrl: './get-single-approval.component.html',
  styleUrls: ['./get-single-approval.component.css']
})
export class GetSingleApprovalComponent implements OnInit {
  private approverSubscription: Subscription;
  approverList;
  token = null;
  approvalId;
  approval;
  approvalCreatedDate;
  trackId;
  claimId;
  timeline;
  err = false;
  private approvalSubscription: Subscription;

  constructor(
    private approvalService: ApprovalFormService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar, private settingsService: SettingsService, private authService: AuthService) { }

  ngOnInit() {
    this.settingsService.getApproverList('true'); //forward = true
    this.token = this.route.snapshot.queryParams['token'];
    this.approvalId = this.route.snapshot.queryParams['approvalId'];

    this.claimId = this.route.snapshot.queryParams['claimId'];
    //console.log("this.claimId",this.claimId)

    if (this.approvalId) {
      this.getSingleApprovalData();
    }
    this.approvalSubscription = this.approvalService.getApprovalListener().subscribe((res) => {
      if ((res as any).error_message) {
        this.openSnackBar((res as any).error_message, 'failure');
        if ((res as any).res) {
          this.approval = (res as any).res;
          this.setTimelineAndApprovalCreatedDate(this.approval);
        }
        return;
      }

      if ((res as any).message) {
        this.openSnackBar((res as any).message, 'success');
        if ((res as any).res) {
          this.approval = (res as any).res;
          this.setTimelineAndApprovalCreatedDate(this.approval);
        }
        return;
      }

      if ((res as any)._id) {
        this.approval = res;
        this.setTimelineAndApprovalCreatedDate(this.approval);
      }
    });

    this.approverSubscription = this.settingsService.getApproverSubjectListener().subscribe((res) => {
      this.approverList = res;
    });

  }

  openSnackBar(message, type) {
    this.snackBar.open(message, null, {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: type
    });
  }

  sendToApprover() {
    const dialogRef = this.dialog.open(ActionDialogComponent,
      {
        data: {
          approverList: this.approverList,

          title: 'Forward',
          to: 'Select Approvers'
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sendForApproval({ forward: true, approvalData: this.approval, emailId: result.email, remarks: result.remarks, file: result.file });
      }
    });
  }

  sendForApproval(e) {
    this.approvalService.sendApproval(e);
  }

  getSingleApprovalData(trackflag: boolean = false) {
    this.approvalService.getSingleApproval(this.approvalId || this.trackId, this.claimId, trackflag);
  }

  trackById() {
    this.trackId = this.trackId.trim().toUpperCase();
    //TODO : need to change the tracking system.
    //pass boolean to below function
    if (this.trackId) {
      this.getSingleApprovalData(true);
    }
  }

  openConfirmatinDialog(text, remarks) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        approverList: [{ email: this.approval.email }],
        title: `${text}`,
        to: 'Initiator',
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

  setTimelineAndApprovalCreatedDate(approval) {
    this.approvalCreatedDate = new Date(approval.date).toLocaleString();
    this.timeline = approval.timeline.split('\n');
  }

}
