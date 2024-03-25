import { VendorDetailsComponent } from './vendor-details/vendor-details.component';
import { SalaryDetailsComponent } from './salary-details/salary-details.component';
import { UtilizationDetailsComponent } from './utilization-details/utilization-details.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApprovalFormService } from './../service/approval-form.service';
import { SettingsService } from './../service/settings.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-approval-form',
  templateUrl: './approval-form.component.html',
  styleUrls: ['./approval-form.component.css']
})
export class ApprovalFormComponent implements OnInit, OnDestroy {
  approvalInput: number;
  payeePlaceholder: string;
  accountnoPlaceholder: string;
  banknamePlaceholder: string;
  ifscPlaceholder: string;
  unutilizedAmount: string;

  private unutilizedSubscription: Subscription;

  public bill: {
    number: string,
    amount: string,
    vendor: string,
    itemDesc: string,
    file: File | null
  }
  bills: any[];

  public salary: {
    number: string,
    amount: string,
    employee: string,
    itemDesc: string,
    file: File | null
  }
  salaries: any[];

  public vendor: {
    number: string,
    amount: number,
    vendorname: string,
    vendorAdd: string,
    preferance: string,
    deliveryschedule: string,
    paymentterms: string,
    unitprice: string,
    netamount: number,
    tax: number,
    remarks: string,
    file: File | null
  }

  vendors: any[];
  //Update form 
  updateApproval: any;
  public queryData: {
    id: string;
    claimId: string;
    trackflag: string
  };
  constructor(public approvalFormService: ApprovalFormService, private approvalService: ApprovalFormService, public settingsService: SettingsService, private snackBar: MatSnackBar, private route: ActivatedRoute) {
    if (
      this.route.snapshot.queryParams.approvalId
    ) {
      this.queryData = {
        id: this.route.snapshot.queryParams.approvalId,
        claimId: this.route.snapshot.queryParams.claimid || 'undefined',
        trackflag: this.route.snapshot.queryParams.claimid || 'true',
      };
    }

    this.bill = {
      number: "",
      amount: "",
      vendor: "",
      itemDesc: "",
      file: null
    }
    this.bills = [this.bill];

    this.salary = {
      number: "",
      amount: "",
      employee: "",
      itemDesc: "",
      file: null
    };
    this.salaries = [this.salary]

    this.vendor = {
      number: "",
      amount: 0.0,
      vendorname: "",
      vendorAdd: "",
      preferance: "",
      deliveryschedule: "",
      paymentterms: "",
      unitprice: "",
      netamount: 0.0,
      tax: 0.0,
      remarks: "",
      file: null
    };
    this.vendors = [this.vendor];
  }
  isOTP = false;
  isOTPVerified = 0;
  isSubmitted;
  isLoading = false;
  approvalForm;
  approvalInputValue = 0;
  approvalPlaceholder = 'Approval/Utilization Details (Item, Amount, Vendor and Bill Details)';
  private otpVerificationSubscription: Subscription;
  private formSubmitSubscription: Subscription;
  private zoneSubscription: Subscription;
  zones = [];
  approvals = [];
  approvalFile;
  invalidAdvanceID = false;


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

    this.approvals.push({ name: 'In Principle or Admin Approval', value: 0 });
    this.approvals.push({ name: 'Advance or Imprest', value: 1 });
    this.approvals.push({ name: 'Claim against advance/PO', value: 2 });
    this.approvals.push({ name: 'Claim', value: 3 });
    this.approvals.push({ name: 'Award Approval', value: 4 });
    this.approvals.push({ name: 'Salary', value: 5 });

    if (this.queryData) {
      this.getApprovalData();

      this.approvalService
        .getApprovalListener()
        .subscribe((res: any) => {
          this.updateApproval = res;
          if (this.updateApproval.fileName) {
            this.approvalFile = {
              name: this.updateApproval.fileName.replace(/^[^-]+-/, "")
            }
          }

          if (this.updateApproval.approval_type == 'Claim against advance/PO') {
            this.getUntilizedamt(null, this.updateApproval.approvalId);
          }

          if (this.updateApproval.approval_type === 'Advance or Imprest' || this.updateApproval.approval_type === 'Claim against advance/PO' || this.updateApproval.approval_type === 'Claim') {
            this.getBillData();
            this.approvalService
              .getBillListener()
              .subscribe((res: any) => {
                if (res && res.length) {
                  this.bills = [];
                  for (const bill of res) {
                    let _bill = {
                      number: bill.billnumber || "",
                      amount: bill.billamount || "",
                      vendor: bill.vendorname || "",
                      itemDesc: bill.description || "",
                      assetDetails: bill.assetdetails || "",
                      assetValue: bill.assetvalue || "",
                      assetCodes: bill.assetcodes || "",
                      file: null,
                      _id: bill._id
                    }
                    if (bill.fileName) {
                      _bill.file = {
                        name: bill.fileName
                      }
                    }
                    this.bills.push(_bill);
                  }
                }
              });

          } else if (this.updateApproval.approval_type === 'Award Approval') {
            this.getVendorData();
            this.approvalService
              .getAwardListener()
              .subscribe((res: any) => {
                console.log(res);
                if (res && res.length) {
                  this.vendors = [];
                  for (const vendor of res) {
                    let _vendor = {
                      number: vendor.billnumber || "",
                      amount: vendor.billamount || 0.0,
                      vendorname: vendor.vendorname || "",
                      vendorAdd: vendor.vendor_addr || "",
                      preferance: vendor.vendor_preference || "",
                      deliveryschedule: vendor.deliveryschedule || "",
                      paymentterms: vendor.payterms || "",
                      unitprice: vendor.unitprice || "",
                      netamount: vendor.netbillamount || 0.0,
                      tax: vendor.gst_tax || 0.0,
                      remarks: vendor.description_warranty || "",
                      shipping: vendor.shipping_handling_chrg || "",
                      file: null,
                      _id: vendor._id
                    }
                    if (vendor.fileName) {
                      _vendor.file = {
                        name: vendor.fileName
                      }
                    }

                    this.vendors.push(_vendor)
                  }
                }
              });
          } else if (this.updateApproval.approval_type === 'Salary') {
            this.getSalaryData()
            this.approvalService.
              getSalaryListener()
              .subscribe((res: any) => {
                console.log(res);
                if (res && res.length) {
                  this.salaries = [];
                  for (const salary of res) {
                    let _salary = {
                      number: salary.salarynumber || "",
                      amount: salary.salaryamount || "",
                      employee: salary.employeename || "",
                      itemDesc: salary.description || "",
                      file: null,
                      _id: salary._id
                    };

                    if (salary.fileName) {
                      _salary.file = {
                        name: salary.fileName
                      }
                    }

                    this.salaries.push(_salary)
                  }
                }
              });
          }
        });
    }

  }

  onSubmit(approvalForm) {
    if (approvalForm.invalid || this.isOTPVerified !== 1) {
      return;
    }
    if (this.approvalInputValue == 2 && this.invalidAdvanceID) {
      this.snackBar.open("Invalid Advance ID", null, {
        duration: 5000,
        verticalPosition: 'top',
        panelClass: 'failure'
      });
      return
    }
    this.isLoading = true;
    this.approvalForm = approvalForm;
    approvalForm.value.bills = this.bills;
    approvalForm.value.vendors = this.vendors;
    approvalForm.value.salaries = this.salaries;
    //console.log(approvalForm.value)
    let data = { ...approvalForm.value };
    if (this.updateApproval && this.updateApproval.approvalId) {
      data.approvalId = this.updateApproval.approvalId
    }
    if (this.updateApproval && this.updateApproval.claimId) {
      data.claimId = this.updateApproval.claimId
    }
    if (approvalForm.value.approval == 0) {
      /* 0 - In Principle or Admin Approval
        
      */
      this.approvalFormService.submitForm(data, this.approvalFile, this.approvals, this.queryData);
    } else {
      //console.log('TODO: New api',this.approvals[approvalForm.value.approval]);
      /* 2 - Claim against advance/PO
         4 - Award Approval
         5 - Salary
         
         Changes Done on 23/06/2021
         1 - Advance or Imprest
         3 - Claim
      */
      //console.log(approvalForm.value.advanceId)
      //console.log("submit form 2",approvalForm.value);
      this.approvalFormService.submitForm2(data, this.approvals, this.queryData);
    }

  }

  onImagePicked(event: Event) {
    this.approvalFile = (event.target as HTMLInputElement).files[0];
    if (this.approvalFile.size > 10485760) {
      this.approvalFile = null
      this.snackBar.open("File size should be less than 10MB", null, {
        duration: 5000,
        verticalPosition: 'top',
        panelClass: 'failure'
      });
    }
  }

  removeFile() {
    this.approvalFile = null
  }

  search(numberKey: string, myArray: any) {
    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i].number === numberKey) {
        return myArray[i];
      }
    }
  }

  approvalChanged(value) {
    if (value === 4) {
      this.payeePlaceholder = 'L1 Vendor name';
      this.accountnoPlaceholder = 'L1 Vendor Account Number';
      this.banknamePlaceholder = 'L1 Vendor Bank Name';
      this.ifscPlaceholder = 'L1 Vendor Bank IFSC';
      this.approvalPlaceholder = 'Approval/Utilization Details';
    } else {
      this.payeePlaceholder = 'Payee Name';
      this.accountnoPlaceholder = 'Account Number';
      this.banknamePlaceholder = 'Bank Name';
      this.ifscPlaceholder = 'Bank IFSC';
      this.approvalPlaceholder = 'Approval/Utilization Details';
    }
    if (value == 0) {
      this.approvalPlaceholder = 'Justify your approval request';
    }
    this.approvalInputValue = value
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
      number: "",
      amount: "",
      employee: "",
      itemDesc: "",
      file: null
    };
    this.salaries.push(newSalary);
    //console.log(this.salaries);
  }
  addVendorComponent() {
    var newVendor = {
      number: "",
      amount: 0.0,
      vendorname: "",
      vendorAdd: "",
      preferance: "",
      deliveryschedule: "",
      paymentterms: "",
      unitprice: "",
      netamount: 0.0,
      tax: 0.0,
      remarks: "",
      file: null
    };
    this.vendors.push(newVendor);
    // console.log(this.vendors);
  }
  addBills() {
    var newBill = {
      number: "",
      amount: "",
      vendor: "",
      itemDesc: "",
      file: null
    }
    this.bills.push(newBill);
    //console.log(this.bills);
  }

  validateBillsFiles() {
    if (this.bills && (this.approvalInputValue == 2 || this.approvalInputValue == 3)) {
      for (let bill of this.bills) {
        if (!bill.file) {
          return false
        }
      }
    }
    return true
  }

  validateVendorFiles() {
    if (this.vendors && this.approvalInputValue == 4) {
      for (let vendor of this.vendors) {
        if (!vendor.file) {
          return false
        }
      }
    }
    return true
  }

  getUntilizedamt(event: any, id: any) {
    var advanceId = event && event.target ? event.target.value : id;
    if (advanceId !== undefined) {
      this.approvalService.getUnutilizedamt(advanceId)
    }
    this.unutilizedSubscription = this.approvalService.getUnutilizedamtListner().subscribe((res) => {
      if ((res as any).error_message) {
        this.unutilizedAmount = "Approval Id does not exist"
        this.invalidAdvanceID = true
      }
      else {
        this.unutilizedAmount = (res as any).unutilizedamount;
        this.invalidAdvanceID = false
      }
      //console.log(this.unutilizedAmount, res);
    });
  }

  getApprovalData() {
    this.approvalService.getSingleApproval(
      this.queryData.id,
      this.queryData.claimId,
      this.queryData.trackflag
    );
  }

  getBillData() {
    this.approvalService.getBillApproval(this.queryData.id);
  }

  getVendorData() {
    this.approvalService.getAwardApproval(this.queryData.id);
  }

  getSalaryData() {
    this.approvalService.getSalaryApproval(this.queryData.id);
  }

  filterApprovals(value) {
    let approvalVal = this.approvals.find(item => item.name === value);
    if (approvalVal) {
      this.approvalChanged(approvalVal.value);
      return approvalVal.value;
    } else {
      return "";
    }
  }
}
