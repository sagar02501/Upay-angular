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
        console.log("this.approval",this.approval);
        this.actionOccured.emit({notify: true, approvalData: this.approval, emailId: result.email, remarks: result.remarks});
      }
    });
  }

  fundTransfer() {
    const dialogRef = this.dialog.open(ActionDialogComponent, {data: {
      title: 'Fund Transfer',
      isFundTransfer: true
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
        this.actionOccured.emit({delete: true, approvalId: this.approval._id});
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
        message: `Are you sure you want to print PO for this approval?`,
        buttonTextPrimary: 'Yes',
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
          console.log(res);
          for (let i = 0; i < this.awardList.length; i++) {
            if (this.awardList[i].vendor_preference  == 'L1'){
                this.awardPodata = this.awardList[i];
              }
              this.printpurchaseorder(this.approval,this.awardPodata)
              // To do call print function and pass award PO data and approval 
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
      const approvalData =
    `<body>
    <header>
        <address contenteditable>
            <h2>Under Privileged Advancement by Youth</h2>
            <p>C/O PRATIK KAMBLE</p>
            <p>BANK COLONY, SHIVAJI WARD</p>
            <p>BHANDARA, MAHARASHTRA, 441904</p>
            <p><b>Phone</b> 9403964873 <strong>EMAIL:</strong> ngoupay@gmail.com</p>
        </address>
        <span>
            <img style="text-align: center" alt="" src="https://www.upay.org.in/wp-content/uploads/2020/03/cropped-logo-1.png">
            <h2 style="color: gray">Purchase Order</h2>
        </span>
        <address contenteditable>
            <h4>The following number must appear on all related correspondence,<br> shipping papers, and invoices:</h4>
            <p style="font-size: 13px">APPROVAL DOC NUMBER:UPAYCE0920
                <br>
                P.O. NUMBER: [UPAY/ZONE/YEAR/SN): UPAY/DEL/2020/07</p>
        </address>
    </header>
    <article>
        <h1>To,</h1>
        <address style="width: 60%">
            <p style="width: 40%">Grocers Delight </p>
            <p style="width: 40%">Account no: 90261010011974</p>
            <p style="width: 40%">Ifsc code: SYNB0009026</p>
            <p style="width: 40%">Syndicate Bank</p>
        </address>
        <label style="float: right;width: 40%">SHIPPING ADDRESS:</label>
        <p style="float: right;width: 40%">Special police unit for NE Region,Delhi police, PTS,Police complex, Malviya nagar, New Delhi- 110017</p>
        <table >
            <thead>
            <tr>
                <th><span contenteditable>P.O. Date</span></th>
                <th><span contenteditable>Procurer name and contact number</th>
                <th><span contenteditable>Warranty if any</span></th>
                <th><span contenteditable>Delivery Schedule</span></th>
                <th><span contenteditable>Payment Terms</span></th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td><span contenteditable>21-05-2020</span></td>
                <td><span contenteditable>Mithila Malhotra 8447284956</span></td>
                <td><span contenteditable>NA</span></td>
                <td><span contenteditable>22-05-2020</span></td>
                <td><span>Full Payment after delivery</span></td>
            </tr>
            </tbody>
        </table>
        <br>
        <table class="inventory" >
            <thead>
            <tr>
                <th><span contenteditable>Quantity</span></th>
                <th><span contenteditable>Unit</span></th>
                <th><span contenteditable>Description</span></th>
                <th><span contenteditable>Unit Price</span></th>
                <th><span contenteditable>Total</span></th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td style="text-align: center"><span contenteditable>200</span></td>
                <td style="text-align: center"><span contenteditable>Number</span></td>
                <td style="text-align: center"><span contenteditable>1 unit of Ration having
    5 kg Rice, 3kg Atta, 1.5 kg Dal, 0.5 kg jaggery,
    2 kg poha, 50 gm haldi,
    50 gm mirchi,, 0.5 lt oil, 1 packet salt and 1 soap</span></td>
                <td style="text-align: center"><span data-prefix>₹</span><span contenteditable>608.5</span></td>
                <td style="text-align: center"><span data-prefix>₹</span><span>121700</span></td>
            </tr>
            </tbody>
        </table>
        <table class="balance">
            <tr>
                <th><span contenteditable>Sub Total</span></th>
                <td><span data-prefix>₹</span><span>600.00</span></td>
            </tr>
            <tr>
                <th><span contenteditable>GST</span></th>
                <td><span data-prefix>₹</span><span contenteditable>0.00</span></td>
            </tr>
            <tr>
                <th><span contenteditable>Shipping & Handling</span></th>
                <td><span data-prefix>₹</span><span contenteditable>0.00</span></td>
            </tr>
            <tr>
                <th><span contenteditable>Other</span></th>
                <td><span data-prefix>₹</span><span contenteditable>0.00</span></td>
            </tr>
            <tr>
                <th><span contenteditable>Grand Total</span></th>
                <td><span data-prefix>₹</span><span>600.00</span></td>
            </tr>
        </table>
        <p>Notes to us that pertain to your purchase</p>
    </article>
    <aside>
      <p>Authorized By </p>
       <p>Accepted By Vendor</p>
        <p>Date </p>
    </aside>
    </body>`;

    const style = `<style>
    {
      border: 0;
      box-sizing: content-box;
      color: inherit;
      font-family: inherit;
      font-size: inherit;
      font-style: inherit;
      font-weight: inherit;
      line-height: inherit;
      list-style: none;
      margin: 0;
      padding: 0;
      text-decoration: none;
      vertical-align: top;
  }

  /* content editable */

  *[contenteditable] { border-radius: 0.25em; min-width: 1em; outline: 0; }

  *[contenteditable] { cursor: pointer; }

  *[contenteditable]:hover, *[contenteditable]:focus, td:hover *[contenteditable], td:focus *[contenteditable], img.hover { background: #DEF; box-shadow: 0 0 1em 0.5em #DEF; }

  span[contenteditable] { display: inline-block; }

  /* heading */

  h1 { font: bold 100% sans-serif; letter-spacing: 0.5em; text-align: center; text-transform: uppercase; }

  /* table */

  table { font-size: 75%; table-layout: fixed; width: 100%; }
  table { border-collapse: separate; border-spacing: 0px; }
  th, td { border-width: 1px; padding: 0.5em; position: relative; text-align: left; }
  th, td { border-radius: 0px; border-style: solid; }
  th { border-color: rgba(62, 62, 62, 0.99); }
  td { border-color: rgba(62, 62, 62, 0.99); }

  /* page */

  html { font: 16px/1 'Open Sans', sans-serif; overflow: auto; padding: 0.5in; }
  html { background: #999; cursor: default; }

  body { box-sizing: border-box; height: 11in; margin: 0 auto; overflow: hidden; padding: 0.5in; width: 8.5in; }
  body { background: #FFF; border-radius: 1px; box-shadow: 0 0 1in -0.25in rgba(0, 0, 0, 0.5); }

  /* header */

  header { margin: 0 0 3em; }
  header:after { clear: both; content: ""; display: table; }

  header h1 { background: #000; border-radius: 0.25em; color: #FFF; margin: 0 0 1em; padding: 0.5em 0; }
  header address { float: left; font-size: 50%; font-style: normal; line-height: 1.25; margin: 0 1em 1em 0; }
  header address p { margin: 0 0 0.25em; }
  header span, header img { display: block; float: right; }
  header span { margin: 0 0 1em 1em; max-height: 25%; max-width: 60%; position: relative; }
  header img { max-height: 100%; max-width: 100%; }
  header input { cursor: pointer; -ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)"; height: 100%; left: 0; opacity: 0; position: absolute; top: 0; width: 100%; }

  /* article */

  article, article address, table.meta, table.inventory { margin: 0 0 3em; }
  article:after { clear: both; content: ""; display: table; }
  article h1 { clip: rect(0 0 0 0); position: absolute; }

  article address { float: left; font-size: 81%; font-weight: bold; }

  /* table meta & balance */

  table.meta, table.balance { float: right; width: 36%; }
  table.meta:after, table.balance:after { clear: both; content: ""; display: table; }

  /* table meta */

  table.meta th { width: 40%; }
  table.meta td { width: 60%; }

  /* table items */

  table.inventory { clear: both; width: 100%; }
  table.inventory th { font-weight: bold; text-align: center; }

  table.inventory td:nth-child(1) { width: 26%; }
  table.inventory td:nth-child(2) { width: 38%; }
  table.inventory td:nth-child(3) { text-align: right; width: 12%; }
  table.inventory td:nth-child(4) { text-align: right; width: 12%; }
  table.inventory td:nth-child(5) { text-align: right; width: 12%; }

  /* table balance */

  table.balance th, table.balance td { width: 50%; }
  table.balance td { text-align: right; }

  /* aside */

  aside h1 { border: none; border-width: 0 0 1px; margin: 0 0 1em; }
  aside h1 { border-color: #999; border-bottom-style: solid; }

  /* javascript */

  .add, .cut
  {
      border-width: 1px;
      display: block;
      font-size: .8rem;
      padding: 0.25em 0.5em;
      float: left;
      text-align: center;
      width: 0.6em;
  }

  .add, .cut
  {
      background: #9AF;
      box-shadow: 0 1px 2px rgba(0,0,0,0.2);
      background-image: -moz-linear-gradient(#00ADEE 5%, #0078A5 100%);
      background-image: -webkit-linear-gradient(#00ADEE 5%, #0078A5 100%);
      border-radius: 0.5em;
      border-color: #0076A3;
      color: #FFF;
      cursor: pointer;
      font-weight: bold;
      text-shadow: 0 -1px 2px rgba(0,0,0,0.333);
  }

  .add { margin: -2.5em 0 0; }

  .add:hover { background: #00ADEE; }

  .cut { opacity: 0; position: absolute; top: 0; left: -1.5em; }
  .cut { -webkit-transition: opacity 100ms ease-in; }

  tr:hover .cut { opacity: 1; }

  @media print {
      * { -webkit-print-color-adjust: exact; }
      html { background: none; padding: 0; }
      body { box-shadow: none; margin: 0; }
      span:empty { display: none; }
      .add, .cut { display: none; }
  }

  @page { margin: 0; }
      </style>`;

    const win = window.open('', '', 'height=700,width=700');

    win.document.write('<html><head>');
    win.document.write('<title>Upay|Purchase Order</title>');
    win.document.write(style);
    win.document.write('</head>');
    win.document.write('<body>');
    win.document.write(approvalData);
    win.document.write('</body></html>');

    win.document.close();

    win.print();
  }
}
