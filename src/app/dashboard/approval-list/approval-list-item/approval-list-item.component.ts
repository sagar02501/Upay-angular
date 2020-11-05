import { Subscription } from 'rxjs';
import { ApprovalFormService } from './../../../service/approval-form.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ActionDialogComponent } from './../../action-dialog/action-dialog.component';
import { AuthService } from 'src/app/service/auth.service';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-approval-list-item',
  templateUrl: './approval-list-item.component.html',
  styleUrls: ['./approval-list-item.component.css']
})
export class ApprovalListItemComponent implements OnInit {
  ApprovalFormService: any;
  awardList;
  timeline;
  awardPodata;
  awardCreatedDate;

  private awardSubscription: Subscription;
  constructor(private dialog: MatDialog, private authService: AuthService,private approvalService: ApprovalFormService,private snackBar: MatSnackBar) { }
  @Input() approval;
  @Input() approverList;
  @Output() actionOccured: EventEmitter<any> = new EventEmitter();
  @Input() openBody = false;
  approvalCreatedDate;
  zone;

  ngOnInit() {
    this.approvalCreatedDate = new Date(this.approval.date).toLocaleString();
    const userZone = this.authService.getUserZone();
    if (userZone === 'central') {
      this.zone = 'Zonal';
    } else {
      this.zone = 'Central';
    }
  }

  openTimeline() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        header: 'Approval Timeline',
        message: this.approval.timeline.split('\n'),
        buttonTextPrimary: 'OK',
        buttonTextSecondary: 'Cancel',
        timeline: true
      }
    });
  }

  confirmSend() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        header: 'Confirm',
        message: `Are you sure you want to send this approval to ${this.zone}?`,
        buttonTextPrimary: 'Send',
        buttonTextSecondary: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.actionOccured.emit({send: true,approval_type:this.approval.approval_type, approvalId: this.approval._id, approval_id: this.approval.approvalId, claim_Id : this.approval.claimId, zone: this.zone, timeline: this.approval.timeline});
      }
    });
  }

  notifyInitiator() {
    const dialogRef = this.dialog.open(ActionDialogComponent, {data: {
      approverList: [{email: this.approval.email}],
      title: 'Notify Initiator',
      to: 'Initiator'
    }});
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //console.log("this.approval",this.approval);
        this.actionOccured.emit({notify: true, approvalData: this.approval, emailId: result.email, remarks: result.remarks});
      }
    });
  }
  withoutfundTransfer(){
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        header: 'Settle Without Fund Transfer',
        message: `Are you sure you want to settle this approval without fund transfer ?`,
        buttonTextPrimary: 'Yes',
        buttonTextSecondary: 'No'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.actionOccured.emit({fundTransfer: true, approvalData: this.approval,
          transactionId: 'WithoutFundTransfer', transferredAmount:0});
      }
    });
    
  }
  fundTransfer() {
    const dialogRef = this.dialog.open(ActionDialogComponent, {data: {
      title: 'Fund Transfer',
      isFundTransfer: true,
      approval :this.approval
    }});
    dialogRef.afterClosed().subscribe(result => {
      if (result && !result.transactionId) {
        const cnf = confirm("You are going to transfer Rs." + result.transferredAmount + " to contact Id " + result.fundAccountIdInput);
        if (cnf) {
          this.actionOccured.emit({
            fundTransfer: true,
            approvalData: this.approval,
            fund_account_id: result.fundAccountIdInput,
            transferredAmount: result.transferredAmount,
            amount: result.transferredAmount * 100,       // for razorpay payout integration
            mode: result.modeInput,
            reference_id: result.referenceIdInput,
            narration: result.narrationInput,
            purpose: result.payoutTypeInput,
            notes: {
              billed_amount: result.billedAmountInput,
              advance_amount: result.advanceAmountInput,
              centre: result.centreInput,
              budget_head: result.budgetHeadInput,
              budget_subhead: result.budgetSubHeadInput,
              expenditure_code: result.expCodeInput,
              invoice_id: result.invoiceInput,
              approval_id: this.approval.approvalId,
              approval_type: this.approval.approval_type
            }
          });
        }
      } else if(result && result.transactionId) {
        this.actionOccured.emit({fundTransfer: true, approvalData: this.approval,
          transactionId: result.transactionId, transferredAmount: result.transferredAmount});
      }
    });
  }

  deleteApproval() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        header: 'Confirm',
        message: `Are you sure you want to delete this approval?`,
        buttonTextPrimary: 'Yes',
        buttonTextSecondary: 'No'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.actionOccured.emit({delete: true, approvalId: this.approval._id,approval_id: this.approval.approvalId,claim_Id : this.approval.claimId});
      }
    });
  }

  sendToApprover() {
    const dialogRef = this.dialog.open(ActionDialogComponent,
       {data: {
         approverList: this.approverList,
          zone: this.zone,
        title: 'Send to Approver'}});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.actionOccured.emit({send: true, approvalData: this.approval, emailId: result.email, remarks: result.remarks});
      }
    });
  }

  printApproval() {

    const approvalData =
    `<h3>Approval Data</h3>
      <div class="print-approval">
      <div>
      <label>Approval Id</label>
      <span>${this.approval.approvalId}</span>
      </div>
      <div>
      <label>Name</label>
      <span>${this.approval.name}</span>
      </div>
      <div>
      <label>Email</label>
      <span>${this.approval.email}</span>
      </div>
      <div>
      <label>Approval Type</label>
      <span>${this.approval.approval_type}</span>
      </div>
      <div>
      <label>Designation</label>
      <span>${this.approval.designation}</span>
      </div>
      <div>
      <label>Created Date</label>
      <span>${this.approvalCreatedDate}</span>
      </div>
      <div>
      <label>Contact</label>
      <span>${this.approval.contact}</span>
      </div>
      <div>
      <label>Amount</label>
      <span>${this.approval.amount}</span>
      </div>
      <div>
      <label>Zone</label>
      <span>${this.approval.zone}</span>
      </div>
      <div>
      <label>Status</label>
      <span>${this.approval.status}</span>
      </div>
      <div class="row">
      <label>Approval Subject</label>
      <span>${this.approval.subject}</span>
      </div>
      <div class="row">
      <label>Approval Details</label>
      <span><pre>${this.approval.body}</pre></span>
      </div>
      <div class="row">
      <label>Payment Details</label>
      <span><pre>${this.approval.payment_details}</pre></span>
      </div>
      <div class="row">
      <label>Advance Details</label>
      <span><pre>${this.approval.advance_details}</pre></span>
      </div>
      <div class="row">
      <label>Timeline</label>
      <span><pre>${this.approval.timeline}</pre></span>
      </div>
    </div>`;

    const style = `<style>
    html {
      font-size: 16px !important;
    }
    .print-approval {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
    }
    .print-approval > div {
      display: flex;
      width: 80%;
      justify-content: space-between;
      align-items: center;
    }
    .print-approval > div + div {
      margin-top: 10px;
    }
    .print-approval > .row {
      display: flex;
      width: 80%;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
    }
    .print-approval label {
      font-weight: 700;
    }
    h3 {
      text-align: center;
    }
      </style>`;

    const win = window.open('', '', 'height=700,width=700');

    win.document.write('<html><head>');
    win.document.write('<title>Approval Data</title>');
    win.document.write(style);
    win.document.write('</head>');
    win.document.write('<body>');
    win.document.write(approvalData);
    win.document.write('</body></html>');

    win.document.close();

    win.print();
  }
  
  printPo() {  
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        header: 'Confirm',
        message: `Are you sure you want to Send PO to Initiator for this approval?`,
        buttonTextPrimary: 'Preview',
        buttonTextSecondary: 'Cancel'
      }
    });
   
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.approval.approvalId) {
          this.getAwardData(this.approval.approvalId);
        }
        this.awardSubscription = this.approvalService.getAwardListener().subscribe((res) => {
          if ((res as any).error_message) {
            this.openSnackBar((res as any).error_message, 'failure');
            return;
          }
          if ((res as any).message) {
            this.openSnackBar((res as any).message, 'success');
            this.awardList = res;
            return;
          }
          this.awardList = res;
          console.log(this.approval);
          for (let i = 0; i < this.awardList.length; i++) {
            if (this.awardList[i].vendor_preference  == 'L1'){
                this.awardPodata = this.awardList[i];
              }
              console.log(this.awardList);
              this.printpurchaseorder(this.approval,this.awardPodata)
          }
        });
      }
    });
  // }
}
  openSnackBar(message, type) {
    this.snackBar.open(message, null, {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: type
    });
  }
  getAwardData(approvalId) {
    this.approvalService.getAwardApproval(approvalId);
  }
  printpurchaseorder(approval,awardPodata){
    console.log(approval)
    // converts ISO 8601 to date
    let date = new Date(awardPodata.date);
    let year = date.getFullYear();
    let months = date.getMonth()+1;
    let dts = date.getDate();
    let dt = ''
    let month = ''
    if (dts < 10) {
      dt = '0' + dts.toString();
    }else{
      dt =  dts.toString();
    }
    if (months < 10) {
      month = '0' + months.toString();
    }else{
      month =  months.toString();
    }
    var approvaldate=(dt+'-' + month + '-'+year.toString());
    const ap = `<div style="box-sizing: border-box;height: 11in;margin: 0 auto;overflow: hidden;padding: 0.5in;width: 8.5in;background: #FFF;border-radius: 1px;box-shadow: 0 0 1in -0.25in rgba(0, 0, 0, 0.5); border:10px black solid;">
    <header style="margin: 0 0 3em;">
    
        <address contenteditable style="float: left;font-size: 50%;font-style: normal;line-height: 1.25;margin: 0 1em 1em 0;border-radius: 0.25em;min-width: 1em;outline: 0;cursor: pointer;">
            <h2 style="font-size: 15px">Under Privileged Advancement by Youth</h2>
            <p style="font-size: 13px;margin: 0 0 0.25em;">C/O PRATIK KAMBLE</p>
            <p style="font-size: 13px;margin: 0 0 0.25em;">BANK COLONY, SHIVAJI WARD</p>
            <p style="font-size: 13px;margin: 0 0 0.25em;">BHANDARA, MAHARASHTRA, 441904</p>
            <p style="font-size: 13px;margin: 0 0 0.25em;"><b>Phone</b> 9403964873 <strong>EMAIL:</strong> ngoupay@gmail.com</p>
        </address>
        <div  style="margin-left:100px; float:right;">
          <center>
          <img src="https://www.upay.org.in/wp-content/uploads/2020/03/cropped-logo-1.png"  alt="UPAY">
        <h3 style="color: gray;">Purchase Order</h2>
          </center>
        </div>
        <div style="clear:both";></div>
        <address contenteditable style="font-size: 80%;font-style: normal;line-height: 1.25;margin: 0 1em 1em 0;border-radius: 0.25em;min-width: 1em;outline: 0;cursor: pointer;">
            <h4>The following number must appear on all related correspondence,<br> shipping papers, and invoices:</h4>
            <p style="font-size: 13px;margin: 0 0 0.25em;">APPROVAL DOC NUMBER:${awardPodata.approvalId}
                <br>
                P.O. NUMBER: [UPAY/ZONE/YEAR/SN): UPAY/${(approval.zone).toUpperCase()}/${year}/${(awardPodata.approvalId).match(/(\d+)/)[0]}</p>
        </address>
    </header>
    <article style="margin: 0 0 3em;">
     <div style="float:left; width:450px;">
     <h1 style="font: bold 100% sans-serif;letter-spacing: 0.5em;text-transform: uppercase;clip: rect(0 0 0 0);">To,</h1>
     <address style="margin: 0 0 3em;font-size: 81%;font-weight: bold;">
         <p style="font-size:13px;font-style: normal;">Vendor Name: ${awardPodata.vendorname}</p>
         <p style="font-size:13px; font-style: normal;">Account no: ${approval.account_no}</p>
         <p style="font-size:13px; font-style: normal;">Ifsc code: ${approval.ifsc_code}</p>
         <p style="font-size:13px; font-style: normal;"> Vendor Address: ${awardPodata.vendor_addr}</p>
         <p style="font-size:13px; font-style: normal;"> Subject: ${approval.subject}</p>
     </address>
     </div>
     <div style="float:left;">
     <label style="width: 40%">Shipping Address:</label>
     <p style="width: 40%">${approval.shipping_addr}</p>
     </div>
     
        
        <table style="font-size: 75%;table-layout: fixed;width: 100%;border-collapse: separate;border-spacing: 0px;">
            <thead>
            <tr>
                <th style="border-width: 1px;padding: 0.5em;position: relative;text-align: left;border-radius: 0px;border-style: solid;border-color: rgba(62, 62, 62, 0.99);"><span contenteditable style="border-radius: 0.25em;min-width: 1em;outline: 0;cursor: pointer;display: inline-block;">P.O. Date</span></th>
                <th style="border-width: 1px;padding: 0.5em;position: relative;text-align: left;border-radius: 0px;border-style: solid;border-color: rgba(62, 62, 62, 0.99);"><span contenteditable style="border-radius: 0.25em;min-width: 1em;outline: 0;cursor: pointer;display: inline-block;">Procurer name and contact number</span></th>
                <th style="border-width: 1px;padding: 0.5em;position: relative;text-align: left;border-radius: 0px;border-style: solid;border-color: rgba(62, 62, 62, 0.99);"><span contenteditable style="border-radius: 0.25em;min-width: 1em;outline: 0;cursor: pointer;display: inline-block;">Warranty if any</span></th>
                <th style="border-width: 1px;padding: 0.5em;position: relative;text-align: left;border-radius: 0px;border-style: solid;border-color: rgba(62, 62, 62, 0.99);"><span contenteditable style="border-radius: 0.25em;min-width: 1em;outline: 0;cursor: pointer;display: inline-block;">Delivery Schedule</span></th>
                <th style="border-width: 1px;padding: 0.5em;position: relative;text-align: left;border-radius: 0px;border-style: solid;border-color: rgba(62, 62, 62, 0.99);"><span contenteditable style="border-radius: 0.25em;min-width: 1em;outline: 0;cursor: pointer;display: inline-block;">Payment Terms</span></th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td style="border-width: 1px;padding: 0.5em;position: relative;text-align: left;border-radius: 0px;border-style: solid;border-color: rgba(62, 62, 62, 0.99);"><span contenteditable style="border-radius: 0.25em;min-width: 1em;outline: 0;cursor: pointer;display: inline-block;">${approvaldate}</span></td>
                <td style="border-width: 1px;padding: 0.5em;position: relative;text-align: left;border-radius: 0px;border-style: solid;border-color: rgba(62, 62, 62, 0.99);"><span contenteditable style="border-radius: 0.25em;min-width: 1em;outline: 0;cursor: pointer;display: inline-block;">${approval.name + '\n'+ approval.contact}</span></td>
                <td style="border-width: 1px;padding: 0.5em;position: relative;text-align: left;border-radius: 0px;border-style: solid;border-color: rgba(62, 62, 62, 0.99);"><span contenteditable style="border-radius: 0.25em;min-width: 1em;outline: 0;cursor: pointer;display: inline-block;">NA</span></td>
                <td style="border-width: 1px;padding: 0.5em;position: relative;text-align: left;border-radius: 0px;border-style: solid;border-color: rgba(62, 62, 62, 0.99);"><span contenteditable style="border-radius: 0.25em;min-width: 1em;outline: 0;cursor: pointer;display: inline-block;">${awardPodata.deliveryschedule}</span></td>
                <td style="border-width: 1px;padding: 0.5em;position: relative;text-align: left;border-radius: 0px;border-style: solid;border-color: rgba(62, 62, 62, 0.99);"><span>${awardPodata.payterms}</span></td>
            </tr>
            </tbody>
        </table>
        <br>
        <table class="inventory" style="font-size: 75%;table-layout: fixed;width: 100%;border-collapse: separate;border-spacing: 0px;margin: 0 0 3em;clear: both;">
            <thead>
            <tr>
                <th style="border-width: 1px;padding: 0.5em;position: relative;text-align: center;border-radius: 0px;border-style: solid;border-color: rgba(62, 62, 62, 0.99);font-weight: bold;"><span contenteditable style="border-radius: 0.25em;min-width: 1em;outline: 0;cursor: pointer;display: inline-block;">Quantity</span></th>
                <th style="border-width: 1px;padding: 0.5em;position: relative;text-align: center;border-radius: 0px;border-style: solid;border-color: rgba(62, 62, 62, 0.99);font-weight: bold;"><span contenteditable style="border-radius: 0.25em;min-width: 1em;outline: 0;cursor: pointer;display: inline-block;">Unit</span></th>
                <th style="border-width: 1px;padding: 0.5em;position: relative;text-align: center;border-radius: 0px;border-style: solid;border-color: rgba(62, 62, 62, 0.99);font-weight: bold;"><span contenteditable style="border-radius: 0.25em;min-width: 1em;outline: 0;cursor: pointer;display: inline-block;">Description</span></th>
                <th style="border-width: 1px;padding: 0.5em;position: relative;text-align: center;border-radius: 0px;border-style: solid;border-color: rgba(62, 62, 62, 0.99);font-weight: bold;"><span contenteditable style="border-radius: 0.25em;min-width: 1em;outline: 0;cursor: pointer;display: inline-block;">Unit Price</span></th>
                <th style="border-width: 1px;padding: 0.5em;position: relative;text-align: center;border-radius: 0px;border-style: solid;border-color: rgba(62, 62, 62, 0.99);font-weight: bold;"><span contenteditable style="border-radius: 0.25em;min-width: 1em;outline: 0;cursor: pointer;display: inline-block;">Total</span></th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td style="text-align: center;border-width: 1px;padding: 0.5em;position: relative;border-radius: 0px;border-style: solid;border-color: rgba(62, 62, 62, 0.99);width: 26%;"><span contenteditable style="border-radius: 0.25em;min-width: 1em;outline: 0;cursor: pointer;display: inline-block;">${approval.awardquantity}</span></td>
                <td style="text-align: center;border-width: 1px;padding: 0.5em;position: relative;border-radius: 0px;border-style: solid;border-color: rgba(62, 62, 62, 0.99);width: 38%;"><span contenteditable style="border-radius: 0.25em;min-width: 1em;outline: 0;cursor: pointer;display: inline-block;">Number</span></td>
                <td style="text-align: center;text-justify: center;border-width: 1px;padding: 0.5em;position: relative;border-radius: 0px;border-style: solid;border-color: rgba(62, 62, 62, 0.99);width: 12%;"><span contenteditable style="border-radius: 0.25em;min-width: 1em;outline: 0;cursor: pointer;display: inline-block;">${approval.awardItemDesc}p</span></td>
                <td style="text-align: center;border-width: 1px;padding: 0.5em;position: relative;border-radius: 0px;border-style: solid;border-color: rgba(62, 62, 62, 0.99);width: 12%;"><span data-prefix>₹</span><span contenteditable style="border-radius: 0.25em;min-width: 1em;outline: 0;cursor: pointer;display: inline-block;">${awardPodata.unitprice}</span></td>
                <td style="text-align: center;border-width: 1px;padding: 0.5em;position: relative;border-radius: 0px;border-style: solid;border-color: rgba(62, 62, 62, 0.99);width: 12%;"><span data-prefix>₹</span><span>${awardPodata.billamount}</span></td>
            </tr>
            </tbody>
        </table>
        <table class="balance" style="font-size: 75%;table-layout: fixed;width: 36%;border-collapse: separate;border-spacing: 0px;float: right;">
            <tr>
                <th style="border-width: 1px;padding: 0.5em;position: relative;text-align: left;border-radius: 0px;border-style: solid;border-color: rgba(62, 62, 62, 0.99);width: 50%;"><span contenteditable style="border-radius: 0.25em;min-width: 1em;outline: 0;cursor: pointer;display: inline-block;">Sub Total</span></th>
                <td style="border-width: 1px;padding: 0.5em;position: relative;text-align: right;border-radius: 0px;border-style: solid;border-color: rgba(62, 62, 62, 0.99);width: 50%;"><span data-prefix>₹</span><span>${awardPodata.billamount}</span></td>
            </tr>
            <tr>
                <th style="border-width: 1px;padding: 0.5em;position: relative;text-align: left;border-radius: 0px;border-style: solid;border-color: rgba(62, 62, 62, 0.99);width: 50%;"><span contenteditable style="border-radius: 0.25em;min-width: 1em;outline: 0;cursor: pointer;display: inline-block;">GST</span></th>
                <td style="border-width: 1px;padding: 0.5em;position: relative;text-align: right;border-radius: 0px;border-style: solid;border-color: rgba(62, 62, 62, 0.99);width: 50%;"><span data-prefix>₹</span><span contenteditable style="border-radius: 0.25em;min-width: 1em;outline: 0;cursor: pointer;display: inline-block;">${awardPodata.gst_tax}</span></td>
            </tr>
            <tr>
                <th style="border-width: 1px;padding: 0.5em;position: relative;text-align: left;border-radius: 0px;border-style: solid;border-color: rgba(62, 62, 62, 0.99);width: 50%;"><span contenteditable style="border-radius: 0.25em;min-width: 1em;outline: 0;cursor: pointer;display: inline-block;">Shipping & Handling</span></th>
                <td style="border-width: 1px;padding: 0.5em;position: relative;text-align: right;border-radius: 0px;border-style: solid;border-color: rgba(62, 62, 62, 0.99);width: 50%;"><span data-prefix>₹</span><span contenteditable style="border-radius: 0.25em;min-width: 1em;outline: 0;cursor: pointer;display: inline-block;">${awardPodata.shipping_handling_chrg}</span></td>
            </tr>
            
            <tr>
                <th style="border-width: 1px;padding: 0.5em;position: relative;text-align: left;border-radius: 0px;border-style: solid;border-color: rgba(62, 62, 62, 0.99);width: 50%;"><span contenteditable style="border-radius: 0.25em;min-width: 1em;outline: 0;cursor: pointer;display: inline-block;">Grand Total</span></th>
                <td style="border-width: 1px;padding: 0.5em;position: relative;text-align: right;border-radius: 0px;border-style: solid;border-color: rgba(62, 62, 62, 0.99);width: 50%;"><span data-prefix>₹</span><span>${parseInt(awardPodata.billamount)+parseInt(awardPodata.shipping_handling_chrg)+parseInt(awardPodata.gst_tax)}</span></td>
            </tr>
        </table>
        <p>Notes to us that pertain to your purchase</p>
    </article>
    <aside>
      <p>Authorized By : Zonal Secretory Finance/ Director Finance </p>
       <p>Accepted By Vendor</p>
        <p>Date </p>
    </aside>
    <center><span>This is a computer-generated document. No signature is required.</span></center>
    </div>`


    const win = window.open('', '', 'height=700,width=700');

    win.document.write('<html><head>');
    win.document.write('<title>Upay|Purchase Order</title>');
    win.document.write('</head>');
    win.document.write('<body>');
    win.document.write(ap);
    win.document.write('</body></html>');
    
    setTimeout(function() {
      win.document.close();
    }, 500);
    const dialogRef = this.dialog.open(ActionDialogComponent, {data: {
      approverList: [{email: this.approval.email}],
      title: 'Notify Initiator',
      to: 'Initiator'
    }});
    

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //console.log("this.approval",this.approval);
        this.actionOccured.emit({notify: true, approvalData: this.approval, po:win.document.body.innerHTML, emailId: result.email, remarks: result.remarks});
      }
    });
    /*
    setTimeout(function() {
      win.document.close();
      win.print();
    }, 500); */
    
  }
}
