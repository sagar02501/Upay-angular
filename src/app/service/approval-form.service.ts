import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApprovalFormService {

  private approvalSubject = new Subject();
  private awardSubject = new Subject();
  private billSubject = new Subject();
  private unutilizedamtSubject = new Subject();
  private approvalStatusSubject = new Subject();
  private otpVerificationSubject = new Subject();
  private formSubmitSubject = new Subject();
  otpURI = '';
  
  billssucces: any[]
  salarysuccess: any[]
  awardsuccess: any[]
  submitBills(approvalId,claimid,data,file){
    const postData = new FormData();
    //claimId
    postData.append('approvalId', approvalId); 
    postData.append('claimId', claimid);  
    postData.append('billnumber', data.number);
    postData.append('billamount', data.amount);
    postData.append('vendorname', data.vendor);
    postData.append('description', data.itemDesc);
    if (file) {
      postData.append('file', file, data.file.name);
    }
    this.http.post(this.url+`/bill`, postData).subscribe((res:any) => {
      console.log(res.message)
    },
    (err) => {
      console.log(err);
      console.log(err.message)
    }
    );
  }
  submitSalary(approvalId,data,file){
    const postData = new FormData();
    postData.append('approvalId', approvalId);  
    postData.append('salarynumber', data.number);
    postData.append('salaryamount', data.amount);
    postData.append('employeename', data.employee);
    postData.append('description', data.itemDesc);
    if (file) {
      postData.append('file', file, data.file.name);
    }
    this.http.post(this.url+`/salary`, postData).subscribe((res:any) => {
      console.log(res.message)

    },
    (err) => {
      console.log(err);
      console.log(err.message)
    }
    );
  }
  submitAward(approvalId,data,file){
    const postData = new FormData();
    postData.append('approvalId', approvalId);  
    postData.append('billnumber', data.number);
    postData.append('billamount', data.amount);
    postData.append('vendorname', data.vendorname);
    postData.append('deliveryschedule', data.deliveryschedule);
    postData.append('payterms', data.paymentterms);
    postData.append('vendor_preference', data.preferance);
    postData.append('unitprice', data.unitprice);
    postData.append('netbillamount', data.netamount);
    postData.append('remarksAndWarranty', data.remarks);
    postData.append('otherAndshipping', data.shipping);
    postData.append('tax', data.tax);
    postData.append('vendorAdd', data.vendorAdd);
       
    if (file) {
      postData.append('file', file, data.file.name);
    }
    this.http.post(this.url+`/awardtable`, postData).subscribe((res:any) => {
      console.log(res.message)
    },
    (err) => {
      console.log(err.message);
      
    }
    );
  }
  constructor(public http: HttpClient) { }
  url = environment.backendURL + 'api/approvals';
  
  submitForm2(data,approvalTypes){
    console.log("Submit Form 2", data);
    const postData1 = new FormData();
    console.log("Submit form 2",data);
    postData1.append('name', data.name);
    postData1.append('zone', data.zone);
    postData1.append('designation', data.designation);
    postData1.append('contact', data.contact);
    postData1.append('email', data.email);
    postData1.append('amount', data.amount);
    postData1.append('subject', data.subject);
    if (approvalTypes[data.approval]) {
      postData1.append('type', approvalTypes[data.approval].name);
    }
    if(data.advanceId){
      postData1.append('advanceid', data.advanceId);
    }
    if (data.payeeName) {
      postData1.append('payeeName', data.payeeName);
    }
    if (data.accountNumber) {
      postData1.append('accountNumber', data.accountNumber);
    }
    if (data.bankName) {
      postData1.append('bankName', data.bankName);
    }
    if (data.bankIfsc) {
      postData1.append('bankIfsc', data.bankIfsc);
    }
    if (data.itemDiscription) {
      postData1.append('awardItemDesc', data.itemDiscription);
    }
    if (data.itemQuantity) {
      postData1.append('awardquantity', data.itemQuantity);
    }
    if (data.shippingAddress) {
      postData1.append('shippingAddress', data.shippingAddress);
    }
    if (data.awardValue) {
      postData1.append('awardValue', data.awardValue);
    }
   
    
    this.http.post(this.url+`/create/`+data.advanceId, postData1).subscribe((res:any) => {
      
      let claimid = res.claimid;
      let approvalId = res.approvalId;
      if(data.approval == 2){
        data.bills.forEach(bill => {
          console.log("inside bills");
          this.submitBills(data.advanceId,claimid,bill,bill.file); 
        });
        this.formSubmitSubject.next(res);
      }
      if(data.approval == 4){
        data.vendors.forEach(vendor => {
          this.submitAward(approvalId,vendor,vendor.file); 
        });
        this.formSubmitSubject.next(res);
      }
      if(data.approval == 5){
        data.salaries.forEach(salary => {
          this.submitSalary(approvalId,salary,salary.file); 
        });  
        this.formSubmitSubject.next(res);
      }
      
    },
    (err) => {
      console.log(err);
      this.formSubmitSubject.next(2);
    }
    );
  }

  submitForm(data, file, approvalTypes) {
    //console.log(data, file);
    const postData = new FormData();
    postData.append('name', data.name);
    postData.append('zone', data.zone);
    postData.append('designation', data.designation);
    postData.append('contact', data.contact);
    postData.append('email', data.email);
    postData.append('amount', data.amount);
    postData.append('subject', data.subject);
    postData.append('body', data.body);
    if (approvalTypes[data.approval]) {
      postData.append('type', approvalTypes[data.approval].name);
    }
     /*
  Code ID: 003
  Author: join.eb@gmail.com Elvin Baghele
  Add new fields:  
    payeeName
    accountNumber
    bankName
    bankIfsc */
  // Commented out code:
  if (data.payeeName) {
    postData.append('payeeName', data.payeeName);
  }
  if (data.accountNumber) {
    postData.append('accountNumber', data.accountNumber);
  }
  if (data.bankName) {
    postData.append('bankName', data.bankName);
  }
  if (data.bankIfsc) {
    postData.append('bankIfsc', data.bankIfsc);
  }
   // Commented out code:
  /* 
    if (data.advanceDetails) {
        postData.append('advanceDetails', data.advanceDetails);
      }
    if (data.paymentDetails) {
      postData.append('paymentDetails', data.paymentDetails);
    }
  */
  // Finish Code ID 003


    if (file) {
      postData.append('file', file, data.name);
    }

    this.http.post(this.url, postData).subscribe((res) => {
      this.formSubmitSubject.next(res);
    },
    (err) => {
      console.log(err);
      this.formSubmitSubject.next(2);
    }
    );
  }
 
  getApproval(search?, sort?, order = -1, pageSize = 10, pageNum = 0,status?, zones?,approvaltype?) {
    sort = sort || 'date';
    //console.log(this.url + `?search=${search}&sort=${sort}&order=${order}&pageSize=${pageSize}&pageNum=${pageNum}&zones=${zones}&status=${status}`)
    this.http.get(this.url + `?search=${search}&sort=${sort}&order=${order}&pageSize=${pageSize}&pageNum=${pageNum}&zones=${zones}&status=${status}&approvaltype=${approvaltype}`).subscribe((res) => {
      this.approvalSubject.next(res);
    },
    (err) => {console.log(err); }
    );
  }

  getSingleApproval(id,claimId,trackflag) {
    this.http.get(this.url + `/getSingleApproval/${id}/${claimId}/${trackflag}`).subscribe((res) => {
      this.approvalSubject.next(res);
    },
    (err) => { this.approvalSubject.next(err.error); }
    );
  }
  getAwardApproval(id) {
    this.http.get(this.url + `/getAwardApproval/${id}`).subscribe((res) => {
      this.awardSubject.next(res);
    },
    (err) => { this.awardSubject.next(err.error); }
    );
  }
  getBillApproval(id) {
    this.http.get(this.url + `/getBillApproval/${id}`).subscribe((res) => {
      this.billSubject.next(res);
    },
    (err) => { this.billSubject.next(err.error); }
    );
  }
  getUnutilizedamt(id) {
    this.http.get(this.url + `/getUnutilizedamt/${id}`).subscribe((res) => {
      this.unutilizedamtSubject.next(res);
    },
    (err) => { this.unutilizedamtSubject.next(err.error); }
    );
  }

  approveApproval(token, remarks) {
    const data = {remarks: remarks};
    this.http.post(this.url + `/confirmation/approved/${token}`, data).subscribe((res) => {
      this.approvalSubject.next(res);
    },
    (err) => {console.log(err); }
    );
  }

  rejectApproval(token, remarks) {
    const data = {remarks};
    this.http.post(this.url + `/confirmation/rejected/${token}`, data).subscribe((res) => {
      this.approvalSubject.next(res);
    },
    (err) => {console.log(err); }
    );
  }

  getApprovalStatusData() {
    this.http.get(this.url + '/approvalStatusData').subscribe((res) => {
      this.approvalStatusSubject.next(res);
    },
    (err) => {console.log(err); }
    );
  }

  sendApproval(data) {
    this.http.post(this.url + '/approve', data).subscribe((res) => {
      this.approvalSubject.next('sentToApproverTrue');
    },
    (err) => {
      console.log(err);
      this.approvalSubject.next('sentToApproverFalse');
    }
    );
  }

  sendToCentral(data) {
    console.log("data",data)
    this.http.post(this.url + '/approve/central', data).subscribe((res) => {
      this.approvalSubject.next('sentToCentralTrue');
    },
    (err) => {
      console.log(err);
      this.approvalSubject.next('sentToCentralFalse');
    }
    );
  }

  notifyInitiator(data) {
    this.http.post(this.url + '/approve/notify', data).subscribe((res) => {
      this.approvalSubject.next('notifyTrue');
    },
    (err) => {
      console.log(err);
      this.approvalSubject.next('notifyFalse');
    }
    );
  }

  fundTransfer(data) {
    this.http.post(this.url + '/approve/fundTransfer', data).subscribe((res) => {
      this.approvalSubject.next(res);
    },
    (err) => {
      this.approvalSubject.next(err.error);
    }
    );
  }

  deleteApproval(data) {
    this.http.delete(this.url + '/' + data.approvalId+ '/' + data.approval_id + '/' + data.claim_Id).subscribe((res) => {
      this.approvalSubject.next('deleteTrue');
    },
    (err) => {
      console.log(err);
      this.approvalSubject.next('deleteFalse');
    }
    );
  }

  sendOTP(data) {
    this.http.get(this.url + `/otp/send/${data}`).subscribe((res: {uri: string}) => {
      this.otpURI = res.uri;
    },
    (err) => {console.log(err); }
    );
  }

  verifyOTP(otp) {
    const otpURI = this.otpURI;
    this.http.get(this.url + `/otp/verify/${otpURI}/${otp}`).subscribe((res: {uri: string}) => {
      this.otpVerificationSubject.next(1);
    },
    (err) => {
      console.log(err);
      this.otpVerificationSubject.next(2);
    }
    );
  }

  getApprovalListener() {
    return this.approvalSubject.asObservable();
  }
  getAwardListener() {
    return this.awardSubject.asObservable();
  }
  getBillListener() {
    return this.billSubject.asObservable();
  }
  getUnutilizedamtListner(){
    return this.unutilizedamtSubject.asObservable();
  }
  getApprovalStatusListener() {
    return this.approvalStatusSubject.asObservable();
  }
  getOTPVerificationListener() {
    return this.otpVerificationSubject.asObservable();
  }
  getFormSubmitListener() {
    return this.formSubmitSubject.asObservable();
  }
}
