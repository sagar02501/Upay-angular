import { VendorDetailsComponent } from './vendor-details/vendor-details.component';
import { SalaryDetailsComponent } from './salary-details/salary-details.component';
import { UtilizationDetailsComponent } from './utilization-details/utilization-details.component';
import { Component, OnInit, OnDestroy} from '@angular/core';
import { ApprovalFormService } from './../service/approval-form.service';
import { SettingsService } from './../service/settings.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { DecimalPipe } from '@angular/common';

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
  unutilizedAmount:string;
  
  private unutilizedSubscription: Subscription;
 
  public bill :{
    number :string,
    amount: string,
    vendor:string,
    itemDesc: string,
    file: File | null
  }
  bills:any[];

 public salary:{
  number :string,
  amount: string,
  employee:string,
  itemDesc: string,
  file:File|null
 }
 salaries: any[];

 public vendor:{
  number :string,
  amount: number,
  vendorname:string,
  vendorAdd:string,
  preferance:string,
  deliveryschedule:string,
  paymentterms:string,
  unitprice:string,
  netamount:number,
  tax:number,
  remarks: string,
  file: File | null 
 }

 vendors : any[];
  constructor(public approvalFormService: ApprovalFormService,private approvalService: ApprovalFormService, public settingsService: SettingsService, private snackBar: MatSnackBar) {
    this.bill ={
      number :"",
      amount: "",
      vendor:"",
      itemDesc: "",
      file:null
    }
    this.bills = [this.bill];

    this.salary = {
      number :"",
      amount: "",
      employee:"",
      itemDesc: "",
      file:null
      };
    this.salaries = [this.salary]
  
    this.vendor = {
      number :"",
      amount: 0.0,
      vendorname:"",
      vendorAdd:"",
      preferance:"",
      deliveryschedule:"",
      paymentterms:"",
      unitprice:"",
      netamount:0.0,
      tax:0.0,
      remarks: "",
      file:null 
    };
    this.vendors= [this.vendor];
   }
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
      this.approvals.push({name: 'Claim against advance/PO', value: 2});
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
    approvalForm.value.bills = this.bills;
    approvalForm.value.vendors = this.vendors;
    approvalForm.value.salaries = this.salaries;
    console.log(approvalForm.value)
    if(approvalForm.value.approval == 0 ||approvalForm.value.approval == 1  || approvalForm.value.approval == 3 ){
       /* 0 - In Principle or Admin Approval
          1 - Advance or Imprest
          3 - Claim
       */
      this.approvalFormService.submitForm(approvalForm.value, this.approvalFile, this.approvals);
    }else{
      //console.log('TODO: New api',this.approvals[approvalForm.value.approval]);
       /* 2 - Claim against advance/PO
          4 - Award Approval
          5 - Salary
       */
      //console.log(approvalForm.value.advanceId)
      console.log("submit form 2",approvalForm.value);
      this.approvalFormService.submitForm2(approvalForm.value, this.approvals);
    }
    
  }

  onImagePicked(event: Event) {
    this.approvalFile = (event.target as HTMLInputElement).files[0];
  }
  
  search(numberKey: string, myArray: any){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].number === numberKey) {
            return myArray[i];
        }
    }
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
    if(value == 0){
      this.approvalPlaceholder = 'Justify your approval request';
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

  addSalaryComponent() {
    var newSalary = {
    number :"",
    amount: "",
    employee:"",
    itemDesc: "",
    file:null
    };
    this.salaries.push(newSalary);
    //console.log(this.salaries);
  }  
  addVendorComponent() {
    var newVendor = {
    number :"",
    amount: 0.0,
    vendorname:"",
    vendorAdd:"",
    preferance:"",
    deliveryschedule:"",
    paymentterms:"",
    unitprice:"",
    netamount:0.0,
    tax:0.0,
    remarks: "",
    file:null
    };
    this.vendors.push(newVendor);
    // console.log(this.vendors);
  } 
  addBills(){
    var newBill ={
      number :"",
      amount: "",
      vendor:"",
      itemDesc: "",
      file:null
    }
    this.bills.push(newBill);
    //console.log(this.bills);
  }
  
  getUntilizedamt(event: any){
    console.log(event.target.value);
    var advanceId = event.target.value;
    if (advanceId !== undefined){
      this.approvalService.getUnutilizedamt(advanceId)
    }
    this.unutilizedSubscription = this.approvalService.getUnutilizedamtListner().subscribe((res) => {
      
      this.unutilizedAmount = (res as any).unutilizedamount;
      console.log(this.unutilizedAmount, res);
    });
  }
}
