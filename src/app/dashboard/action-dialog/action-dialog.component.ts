import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatSnackBar } from '@angular/material';
@Component({
  selector: 'app-action-dialog',
  templateUrl: './action-dialog.component.html',
  styleUrls: ['./action-dialog.component.css']
})
export class ActionDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private snackBar: MatSnackBar) { }
  budgetSubHeadInput;
  approverList;
  title;
  to;
  isFundTransfer;
  isSendToUpdate;
  approval
  isNew = true;
  isManualFundHide;
  placeholder;
  modeList = ["NEFT", "RTGS", "IMPS", "UPI"];
  expCodes = ["Center", "Zonal", "Central"];
  types = [{
    name: "Salary/Stipened",
    value: "salary"
  },
  {
    name: "Vendor Bill",
    value: "vendor bill"
  },
  {
    name: "Utility Bill",
    value: "utility bill"
  },
  {
    name: "Refund",
    value: "refund"
  }];

  budgetHead = [{
    technicalName: "BH01",
    friendlyName: "Center Operation"
  }, {
    technicalName: "BH02",
    friendlyName: "Center Development"
  }, {
    technicalName: "BH03",
    friendlyName: "Child Development Activities"
  }, {
    technicalName: "BH04",
    friendlyName: "Social Awareness Events"
  }, {
    technicalName: "BH05",
    friendlyName: "Center Expansion"
  }, {
    technicalName: "BH06",
    friendlyName: "Fund Raising Events"
  }, {
    technicalName: "BH07",
    friendlyName: "Legal and Statutory"
  }, {
    technicalName: "BH08",
    friendlyName: "Publicity and Promotional Events"
  }, {
    technicalName: "BH09",
    friendlyName: "Training Development and Research"
  }, {
    technicalName: "BH10",
    friendlyName: "Administrative Events"
  }, {
    technicalName: "BH11",
    friendlyName: "Library Operations"
  }, {
    technicalName: "BH12",
    friendlyName: "Skill Development"
  }, {
    technicalName: "BH13",
    friendlyName: "Women Empowerment"
  }];

  budgetSubHead = [{
    budgetHeadTechnicalName: "BH01",
    friendlyName: "Salary and Allowances"
  }, {
    budgetHeadTechnicalName: "BH01",
    friendlyName: "Books and Stationary Items"
  }, {
    budgetHeadTechnicalName: "BH01",
    friendlyName: "Rental Charges"
  }, {
    budgetHeadTechnicalName: "BH01",
    friendlyName: "Miscellaneous"
  }, {
    budgetHeadTechnicalName: "BH02",
    friendlyName: "Electrical Works and Appliances"
  }, {
    budgetHeadTechnicalName: "BH02",
    friendlyName: "Establishment Cost"
  }, {
    budgetHeadTechnicalName: "BH02",
    friendlyName: "Beautification and Advancements"
  }, {
    budgetHeadTechnicalName: "BH03",
    friendlyName: "Sports Activities"
  }, {
    budgetHeadTechnicalName: "BH03",
    friendlyName: "Counselling and immunization"
  }, {
    budgetHeadTechnicalName: "BH03",
    friendlyName: "Nutritional Drives"
  }, {
    budgetHeadTechnicalName: "BH03",
    friendlyName: "Cultural Activities"
  }, {
    budgetHeadTechnicalName: "BH04",
    friendlyName: "Health, Environment and Sanitization"
  }, {
    budgetHeadTechnicalName: "BH04",
    friendlyName: "Protection of Child Abuse Drives"
  }, {
    budgetHeadTechnicalName: "BH04",
    friendlyName: "Other Social Awareness Drives"
  }, {
    budgetHeadTechnicalName: "BH05",
    friendlyName: "Center Expansion"
  }, {
    budgetHeadTechnicalName: "BH06",
    friendlyName: "Fund Raising"
  }, {
    budgetHeadTechnicalName: "BH06",
    friendlyName: "Other Fund Raising Events"
  }, {
    budgetHeadTechnicalName: "BH07",
    friendlyName: "Legal and Statutory"
  }, {
    budgetHeadTechnicalName: "BH08",
    friendlyName: "Social and Other Media"
  }, {
    budgetHeadTechnicalName: "BH08",
    friendlyName: "PR Events/Material"
  }, {
    budgetHeadTechnicalName: "BH09",
    friendlyName: "Training Research and Development"
  }, {
    budgetHeadTechnicalName: "BH10",
    friendlyName: "Employees Salary"
  }, {
    budgetHeadTechnicalName: "BH10",
    friendlyName: "Rental Charges"
  }, {
    budgetHeadTechnicalName: "BH10",
    friendlyName: "Meetings and Travels"
  }, {
    budgetHeadTechnicalName: "BH10",
    friendlyName: "Miscellaneous Office Expenditure"
  }, {
    budgetHeadTechnicalName: "BH11",
    friendlyName: "Establishment Cost"
  }, {
    budgetHeadTechnicalName: "BH11",
    friendlyName: "Books and Magazines"
  }, {
    budgetHeadTechnicalName: "BH11",
    friendlyName: "Librarian's Salary"
  }, {
    budgetHeadTechnicalName: "BH11",
    friendlyName: "Rental Charges"
  }, {
    budgetHeadTechnicalName: "BH12",
    friendlyName: "Establishment Cost"
  }, {
    budgetHeadTechnicalName: "BH12",
    friendlyName: "Material"
  }, {
    budgetHeadTechnicalName: "BH12",
    friendlyName: "Trainer's Salary"
  }, {
    budgetHeadTechnicalName: "BH12",
    friendlyName: "Rental Charges"
  }, {
    budgetHeadTechnicalName: "BH13",
    friendlyName: "Menstrual Hygene"
  }, {
    budgetHeadTechnicalName: "BH13",
    friendlyName: "Other Empowerment Drives"
  }];

  subBudgetHeadChangeEvent = []
  budgetHeadChanged(value) {
    this.subBudgetHeadChangeEvent = this.budgetSubHead.filter(sb => sb.budgetHeadTechnicalName == value);
  }
  advanceAmountInput = 0;
  ngOnInit() {
    this.approval = this.data.approval || '';
    if (this.data.approval !== undefined)
      this.advanceAmountInput = this.data.approval.amount || 0;
    //console.log(this.advanceAmountInput);
    this.approverList = this.data.approverList || [];
    this.title = this.data.title || '';
    this.to = this.data.to || 'Approver';
    this.isFundTransfer = this.data.isFundTransfer || false;
    this.isSendToUpdate = this.data.isSendToUpdate || false;
    if (this.data.to || this.data.isSendToUpdate) {
      this.placeholder = 'Remarks';
    } else {
      this.placeholder = 'Remarks/DOP Clause';
    }

    // if (this.approval.approval_type == "In Principle or Admin Approval") {
    //   this.isManualFundHide = true;
    // }
    this.isManualFundHide = false;
    if (this.data.approval && (this.data.approval.approval_type == "Claim against advance/PO" || this.data.approval.approval_type == "Claim")) {
      this.isManualFundHide = true;
    }

  }
  file: File | null
  onImagePicked(event: Event) {
    this.file = (event.target as HTMLInputElement).files[0];
    if (this.file.size > 10485760) {
      this.file = null;
      (event.target as HTMLInputElement).value = null
      this.snackBar.open("File size should be less than 10MB", null, {
        duration: 5000,
        verticalPosition: 'top',
        panelClass: 'failure'
      });
    }
  }
  openPaymentDashboard() {
    window.open('https://x.razorpay.com/contacts', '_blank')
  }

}
