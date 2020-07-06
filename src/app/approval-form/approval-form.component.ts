import { VendorDetailsComponent } from './vendor-details/vendor-details.component';
import { SalaryDetailsComponent } from './salary-details/salary-details.component';
import { UtilizationDetailsComponent } from './utilization-details/utilization-details.component';
import { Component, OnInit, OnDestroy, ComponentFactoryResolver, ComponentRef, ViewContainerRef,AfterViewInit,ViewChild} from '@angular/core';
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
  approvalInput:number;
  payeePlaceholder: string;
  accountnoPlaceholder: string;
  banknamePlaceholder: string;
  ifscPlaceholder: string;

  constructor(public approvalFormService: ApprovalFormService, public settingsService: SettingsService, private snackBar: MatSnackBar,private resolver: ComponentFactoryResolver) { }
  isOTP = false;
  isOTPVerified = 0;
  isSubmitted;
  isLoading = false;
  approvalForm;
  approvalPlaceholder = 'Approval/Utilization Details (Item, Amount, Vendor and Bill Details)';
  private otpVerificationSubscription: Subscription;
  private formSubmitSubscription: Subscription;
  private zoneSubscription: Subscription;
  zones = [];
  approvals = [];
  approvalFile;
  /* no change */
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
      this.approvals.push({name: 'Award Approval', value: 4});
      this.approvals.push({name: 'Salary', value: 5});
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

  approvalChanged(value) {
    if (value === 4) {
      this.payeePlaceholder = 'Vendor name';
      this.accountnoPlaceholder = 'Vendor Account Number';
      this.banknamePlaceholder = 'Vendor Bank Name';
      this.ifscPlaceholder = 'Vendor Bank IFSC';
      this.approvalPlaceholder = 'Vendors Details with account number / admin approval Id / price comparison';
    } else {
      this.payeePlaceholder = 'Payee Name';
      this.accountnoPlaceholder = 'Account Number';
      this.banknamePlaceholder = 'Bank Name';
      this.ifscPlaceholder = 'Bank IFSC';
      this.approvalPlaceholder = 'Approval/Utilization Details (Item, Amount, Vendor and Bill Details)';
    }
  
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

  @ViewChild('appenHere', {read : ViewContainerRef}) target: ViewContainerRef;
  private componentRef: ComponentRef<any>;

  addNewComponent() {
    let childComponent = this.resolver.resolveComponentFactory(UtilizationDetailsComponent);
    this.componentRef = this.target.createComponent(childComponent); 
  } 
  addSalaryComponent() {
    let childComponent = this.resolver.resolveComponentFactory(SalaryDetailsComponent);
    this.componentRef = this.target.createComponent(childComponent); 
  }  
  addVendorComponent() {
    let childComponent = this.resolver.resolveComponentFactory(VendorDetailsComponent);
    this.componentRef = this.target.createComponent(childComponent); 
  } 
}
