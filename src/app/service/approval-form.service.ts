import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApprovalFormService {

  private approvalSubject = new Subject();
  private approvalStatusSubject = new Subject();
  private otpVerificationSubject = new Subject();
  private formSubmitSubject = new Subject();
  otpURI = '';

  constructor(public http: HttpClient) { }
  url = environment.backendURL + 'api/approvals';
  
  submitForm(data, file, approvalTypes) {
    console.log(data, file);
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
    if (data.advanceDetails) {
      postData.append('advanceDetails', data.advanceDetails);
    }
    if (data.paymentDetails) {
      postData.append('paymentDetails', data.paymentDetails);
    }
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

  getSingleApproval(id) {
    this.http.get(this.url + `/getSingleApproval/${id}`).subscribe((res) => {
      this.approvalSubject.next(res);
    },
    (err) => { this.approvalSubject.next(err.error); }
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
    this.http.delete(this.url + '/' + data.approvalId).subscribe((res) => {
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
