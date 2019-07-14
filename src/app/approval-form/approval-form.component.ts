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
export class ApprovalFormComponent implements OnInit, OnDestroy {

  constructor(public approvalFormService: ApprovalFormService, public settingsService: SettingsService, private snackBar: MatSnackBar) { }
  isOTP = false;
  isOTPVerified = 0;
  isSubmitted;
  isLoading = false;
  approvalForm;
  private otpVerificationSubscription: Subscription;
  private formSubmitSubscription: Subscription;
  private zoneSubscription: Subscription;
  zones = [];
  approvals = [];
  approvalFile;

  ngOnInit() {
    this.settingsService.getZoneList();
    this.otpVerificationSubscription = this.approvalFormService.getOTPVerificationListener()
      .subscribe((res) => {
        this.isOTPVerified = res as any;
      });
    this.formSubmitSubscription = this.approvalFormService.getFormSubmitListener()
      .subscribe((res) => {
        this.isSubmitted = res as any;
        if (res && this.isSubmitted.approvalId) {
          this.approvalForm.reset();
          this.openSnackBar('Approval sent successfully');
          this.isLoading = false;
        } else if (res === 2) {
          this.openSnackBar('Approval could not be submitted');
          this.isLoading = false;
        }
      });

      this.zoneSubscription = this.settingsService.getZoneSubjectListener().subscribe((res) => {
        this.zones = res as any;
      });

      this.approvals.push({name: 'In Principle or Admin Approval', value: 0});
      this.approvals.push({name: 'Advance or Imprest', value: 1});
      this.approvals.push({name: 'Claim against advance', value: 2});
      this.approvals.push({name: 'Claim', value: 3});
  }

  onSubmit(approvalForm) {
    if (approvalForm.invalid || this.isOTPVerified !== 1) {
      return;
    }
    this.isLoading = true;
    this.approvalForm = approvalForm;
    this.approvalFormService.submitForm(approvalForm.value, this.approvalFile, this.approvals);
  }

  onImagePicked(event: Event) {
    this.approvalFile = (event.target as HTMLInputElement).files[0];
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
      panelClass: this.isSubmitted.approvalId ? 'success' : 'failure'
    });
  }

  ngOnDestroy() {
    this.formSubmitSubscription.unsubscribe();
    this.otpVerificationSubscription.unsubscribe();
    this.zoneSubscription.unsubscribe();
  }

}
