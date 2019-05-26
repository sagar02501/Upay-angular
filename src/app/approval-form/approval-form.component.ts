import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApprovalFormService } from './../service/approval-form.service';
import { SettingsService } from './../service/settings.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-approval-form',
  templateUrl: './approval-form.component.html',
  styleUrls: ['./approval-form.component.css']
})
export class ApprovalFormComponent implements OnInit {

  constructor(public approvalFormService: ApprovalFormService, public settingsService: SettingsService, private snackBar: MatSnackBar) { }
  isOTP = false;
  isOTPVerified = 0;
  isSubmitted = 0;
  isLoading = false;
  approvalForm;
  private otpVerificationSubscription: Subscription;
  private formSubmitSubscription: Subscription;
  private zoneSubscription: Subscription;
  zones = [];

  ngOnInit() {
    this.settingsService.getZoneList();
    this.otpVerificationSubscription = this.approvalFormService.getOTPVerificationListener()
      .subscribe((res) => {
        this.isOTPVerified = res as any;
      });
    this.formSubmitSubscription = this.approvalFormService.getFormSubmitListener()
      .subscribe((res) => {
        this.isSubmitted = res as any;
        if (res === 1) {
          this.approvalForm.reset();
          this.openSnackBar('Approval sent successfully');
        } else if (res === 2) {
          this.openSnackBar('Approval could not be submitted');
        }
      });

      this.zoneSubscription = this.settingsService.getZoneSubjectListener().subscribe((res) => {
        this.zones = res as any;
      });
  }

  onSubmit(approvalForm) {
    if (approvalForm.invalid || this.isOTPVerified !== 1) {
      return;
    }
    this.approvalForm = approvalForm;
    this.approvalFormService.submitForm(approvalForm.value);
  }

  sendOTP(phone) {
    this.isOTP = true;
    this.approvalFormService.sendOTP(phone);
  }
  verifyOTP(otp) {
    this.approvalFormService.verifyOTP(otp);
  }

  openSnackBar(message) {
    this.snackBar.open(message, null, {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: this.isSubmitted === 1 ? 'success' : 'failure'
    });
  }

  OnDestroy() {
    this.formSubmitSubscription.unsubscribe();
    this.otpVerificationSubscription.unsubscribe();
    this.zoneSubscription.unsubscribe();
  }

}
