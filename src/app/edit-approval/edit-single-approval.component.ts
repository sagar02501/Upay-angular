import { Component, OnInit } from '@angular/core';
import { ApprovalFormService } from '../service/approval-form.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SettingsService } from '../service/settings.service';
import { AuthService } from '../service/auth.service';
import { ActionDialogComponent } from '../dashboard/action-dialog/action-dialog.component';


@Component({
  selector: 'app-edit-single-approval',
  templateUrl: './edit-single-approval.component.html',
  styleUrls: ['./edit-single-approval.component.css']
})
export class EditSingleApprovalComponent implements OnInit {
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
  return_editable;
  contact: {};
  isOTP = false;
  isOTPVerified = 0;
  constructor(
    public approvalFormService: ApprovalFormService,
    private approvalService: ApprovalFormService,
    private approvalForwardService: ApprovalFormService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar, private settingsService: SettingsService, private authService: AuthService) { }

  isSubmitted;
  private otpVerificationSubscription: Subscription;
  private formSubmitSubscription: Subscription;


  ngOnInit() {

    this.otpVerificationSubscription = this.approvalFormService.getOTPVerificationListener()
      .subscribe((res) => {
        this.isOTPVerified = res as any;
      });
    // this.settingsService.getApproverList('true'); //forward = true
    // this.token = this.route.snapshot.queryParams['token'];
    this.approvalId = this.route.snapshot.queryParams['approvalId'];

    // this.claimId = this.route.snapshot.queryParams['claimId'];
    //console.log("this.claimId",this.claimId)
    // this.return_editable = this.route.snapshot.queryParams['return_editable'];
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
        //console.log(res);
        //  if(res.return_editable)
        this.approval = res;
        if ((res as any).return_editable !== undefined && (res as any).return_editable == true) {
          this.approval = res;
          //console.log(res);
          // if (this.approval) {
          //   this.approvalCreatedDate = new Date(this.approval.date).toLocaleString();
          //   this.timeline = this.approval.timeline.split('\n');
          // }
        }
        //  else {
        //   this.openSnackBar("Unable edit this approval ID", 'failure');
        //   return;
        // }
        return;
      }
      //console.log((res as any).return_editable);
      if ((res as any).return_editable !== undefined && (res as any).return_editable == true) {
        this.approval = res;
        //console.log(res);
        if (this.approval) {
          this.approvalCreatedDate = new Date(this.approval.date).toLocaleString();
          this.timeline = this.approval.timeline.split('\n');
        }
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
  onSubmit() {
    //add submit button for edit
    if (this.isOTPVerified !== 1) {
      return;
    }

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
  sendOTP(phone) {
    this.isOTP = true;
    this.approvalFormService.sendOTP(phone);
  }
  verifyOTP(otp) {
    this.approvalFormService.verifyOTP(otp);
  }

  ngOnDestroy() {
    this.formSubmitSubscription.unsubscribe();
    this.otpVerificationSubscription.unsubscribe();

  }
}
