import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApprovalFormService {

  private approvalSubject = new Subject();
  private otpVerificationSubject = new Subject();
  private formSubmitSubject = new Subject();
  otpURI = '';

  constructor(public http: HttpClient) { }
  url = environment.backendURL + 'api/approvals';

  submitForm(data) {
    console.log(data);
    this.http.post(this.url, data).subscribe((res) => {
      this.formSubmitSubject.next(1);
    },
    (err) => {
      console.log(err);
      this.formSubmitSubject.next(2);
    }
    );
  }

  getApproval() {
    this.http.get(this.url).subscribe((res) => {
      this.approvalSubject.next(res);
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
      this.approvalSubject.next('sentToCenralTrue');
    },
    (err) => {
      console.log(err);
      this.approvalSubject.next('sentToCenralFalse');
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
  getOTPVerificationListener() {
    return this.otpVerificationSubject.asObservable();
  }
  getFormSubmitListener() {
    return this.formSubmitSubject.asObservable();
  }
}
