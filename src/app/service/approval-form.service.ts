import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApprovalFormService {

  private approvalSubject = new Subject();
  private allApprovalSubject = new Subject();
  private awardSubject = new Subject();
  private billSubject = new Subject();
  private salarySubject = new Subject();
  private unutilizedamtSubject = new Subject();
  private approvalStatusSubject = new Subject();
  private otpVerificationSubject = new Subject();
  private formSubmitSubject = new Subject();
  otpURI = '';

  billssucces: any[]
  salarysuccess: any[]
  awardsuccess: any[]

  url = environment.backendURL + 'api/approvals';

  constructor(public http: HttpClient) { }

  submitBills(approvalId, claimid, data, file) {
    const postData = new FormData();
    //claimId
    postData.append('approvalId', approvalId);
    postData.append('claimId', claimid);
    postData.append('billnumber', data.number);
    postData.append('billamount', data.amount);
    postData.append('vendorname', data.vendor);
    postData.append('description', data.itemDesc);
    postData.append('assetdetails', data.assetDetails);
    postData.append('assetvalue', data.assetValue);
    postData.append('assetcodes', data.assetCodes);
    if (file) {
      postData.append('file', file, data.file.name);
    }
    this.http.post(this.url + `/bill`, postData).subscribe((res: any) => {
      //console.log(res.message)
    },
      (err) => {
        console.log(err);
        console.log(err.message)
      }
    );
  }

  updateBills(approvalId, claimid, billId, data) {
    const postData = new FormData();
    //claimId
    postData.append('approvalId', approvalId);
    postData.append('claimId', claimid);
    postData.append('billnumber', data.number);
    postData.append('billamount', data.amount);
    postData.append('vendorname', data.vendor);
    postData.append('description', data.itemDesc);
    postData.append('assetdetails', data.assetDetails);
    postData.append('assetvalue', data.assetValue);
    postData.append('assetcodes', data.assetCodes);
    if (data.file instanceof File) {
      postData.append('file', data.file, data.file.name);
    }
    this.http.put(this.url + `/bill/${billId}`, postData).subscribe((res: any) => {
      //console.log(res.message)
    },
      (err) => {
        console.log(err);
        console.log(err.message)
      }
    );
  }


  updateAward(approvalId, id, data) {
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

    if (data.file instanceof File) {
      postData.append('file', data.file, data.file.name);
    }
    this.http.put(this.url + `/awardtable/${id}`, postData).subscribe((res: any) => {
      //console.log(res.message)
    },
      (err) => {
        console.log(err.message);

      }
    );
  }

  updateSalary(approvalId, id, data) {
    const postData = new FormData();
    postData.append('approvalId', approvalId);
    postData.append('salarynumber', data.number);
    postData.append('salaryamount', data.amount);
    postData.append('employeename', data.employee);
    postData.append('description', data.itemDesc);

    if (data.file instanceof File) {
      postData.append('file', data.file, data.file.name);
    }
    this.http.put(this.url + `/salary/${id}`, postData).subscribe((res: any) => {
      //console.log(res.message)
    },
      (err) => {
        console.log(err.message);

      }
    );
  }

  submitSalary(approvalId, data, file) {
    const postData = new FormData();
    postData.append('approvalId', approvalId);
    postData.append('salarynumber', data.number);
    postData.append('salaryamount', data.amount);
    postData.append('employeename', data.employee);
    postData.append('description', data.itemDesc);
    if (file) {
      postData.append('file', file, data.file.name);
    }
    this.http.post(this.url + `/salary`, postData).subscribe((res: any) => {
      //console.log(res.message)

    },
      (err) => {
        console.log(err);
        console.log(err.message)
      }
    );
  }

  submitAward(approvalId, data, file) {
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
    this.http.post(this.url + `/awardtable`, postData).subscribe((res: any) => {
      //console.log(res.message)
    },
      (err) => {
        console.log(err.message);

      }
    );
  }

  submitForm2(data, approvalTypes, queryData?) {
    //console.log("Submit Form 2", data);
    const postData1 = new FormData();
    //console.log("Submit form 2",data);
    postData1.append('name', data.name);
    postData1.append('zone', data.zone);
    postData1.append('designation', data.designation);
    postData1.append('contact', data.contact);
    postData1.append('email', data.email);
    postData1.append('amount', data.amount);
    postData1.append('subject', data.subject);
    postData1.append('body', data.body);
    if (approvalTypes[data.approval]) {
      postData1.append('type', approvalTypes[data.approval].name);
    }
    if (data.advanceId) {
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

    if (data.approvalId) {
      postData1.append('approvalId', data.approvalId);
    }

    if (data.claimId) {
      postData1.append('claimId', data.claimId);
    }

    if (queryData !== undefined) {
      this.http.put(this.url + `/update/` + data.advanceId, postData1).subscribe((res: any) => {

        let claimId = res.claimId;
        let approvalId = res.approvalId;

        if (data.approval == 2) {
          data.bills.forEach(bill => {
            console.log("inside bills");
            if (bill._id) {
              this.updateBills(data.advanceId, claimId, bill._id, bill);
            } else {
              this.submitBills(data.advanceId, claimId, bill, bill.file);
            }
          });

          this.formSubmitSubject.next(res);
        }

        if (data.approval == 1 || data.approval == 3) {
          data.bills.forEach(bill => {
            console.log("inside bills");
            if (bill._id) {
              this.updateBills(approvalId, null, bill._id, bill);
            } else {
              this.submitBills(approvalId, null, bill, bill.file);
            }
          });
          this.formSubmitSubject.next(res);
        }

        if (data.approval == 4) {
          data.vendors.forEach(vendor => {
            if (vendor._id) {
              this.updateAward(approvalId, vendor._id, vendor);
            } else {
              this.submitAward(approvalId, vendor, vendor.file);
            }
          });
          this.formSubmitSubject.next(res);
        }

        if (data.approval == 5) {
          data.salaries.forEach(salary => {
            if (salary._id) {
              this.updateSalary(approvalId, salary._id, salary);
            } else {
              this.submitSalary(approvalId, salary, salary.file);
            }
          });
          this.formSubmitSubject.next(res);
        }

      },
        (err) => {
          console.log(err);
          this.formSubmitSubject.next(2);
        }
      );
    } else {
      this.http.post(this.url + `/create/` + data.advanceId, postData1).subscribe((res: any) => {

        let claimid = res.claimid;
        let approvalId = res.approvalId;
        if (data.approval == 2) {
          data.bills.forEach(bill => {
            // console.log("inside bills");
            this.submitBills(data.advanceId, claimid, bill, bill.file);
          });
          this.formSubmitSubject.next(res);
        }
        if (data.approval == 1 || data.approval == 3) {
          data.bills.forEach(bill => {
            console.log("inside bills");
            this.submitBills(approvalId, null, bill, bill.file);
          });
          this.formSubmitSubject.next(res);
        }
        if (data.approval == 4) {
          data.vendors.forEach(vendor => {
            this.submitAward(approvalId, vendor, vendor.file);
          });
          this.formSubmitSubject.next(res);
        }
        if (data.approval == 5) {
          data.salaries.forEach(salary => {
            this.submitSalary(approvalId, salary, salary.file);
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
  }

  submitForm(data, file, approvalTypes, queryData?) {
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

    if (file instanceof File) {
      postData.append('file', file, data.name + '-' + file.name);
    }

    if (data.approvalId) {
      postData.append('approvalId', data.approvalId);
    }

    if (queryData !== undefined) {
      this.http.put(this.url, postData).subscribe((res) => {
        this.formSubmitSubject.next(res);
      },
        (err) => {
          console.log(err);
          this.formSubmitSubject.next(2);
        }
      );
    } else {
      this.http.post(this.url, postData).subscribe((res) => {
        this.formSubmitSubject.next(res);
      },
        (err) => {
          console.log(err);
          this.formSubmitSubject.next(2);
        }
      );
    }


  }

  getAllApproval(search?, sort?, order = -1, pageSize = Math.pow(10, 10), pageNum = 0, status?, zones?, approvaltype?) {
    sort = sort || 'date';
    this.http.get(this.url + `?search=${search}&sort=${sort}&order=${order}&pageSize=${pageSize}&pageNum=${pageNum}&zones=${zones}&status=${status}&approvaltype=${approvaltype}`).subscribe((res) => {
      this.allApprovalSubject.next(res);
    },
      (err) => { console.log(err); }
    );
  }

  getApproval(search?, sort?, order = -1, pageSize = 10, pageNum = 0, status?, zones?, approvaltype?, start?, end?) {
    sort = sort || 'date';
    this.http.get(this.url + `?search=${search}&sort=${sort}&order=${order}&pageSize=${pageSize}&pageNum=${pageNum}&zones=${zones}&status=${status}&approvaltype=${approvaltype}&start=${start}&end=${end}`).subscribe((res) => {
      this.approvalSubject.next(res);
    },
      (err) => { console.log(err); }
    );
  }

  getSingleApproval(id, claimId, trackflag) {
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

  getSalaryApproval(id) {
    this.http.get(this.url + `/salary/${id}`).subscribe((res) => {
      this.salarySubject.next(res);
    },
      (err) => { this.salarySubject.next(err.error); }
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
    const data = { remarks: remarks };
    this.http.post(this.url + `/confirmation/approved/${token}`, data).subscribe((res) => {
      this.approvalSubject.next(res);
    },
      (err) => { console.log(err); this.approvalSubject.next(err.error); }
    );
  }

  rejectApproval(token, remarks) {
    const data = { remarks };
    this.http.post(this.url + `/confirmation/rejected/${token}`, data).subscribe((res) => {
      this.approvalSubject.next(res);
    },
      (err) => { console.log(err); this.approvalSubject.next(err.error); }
    );
  }

  getApprovalStatusData() {
    this.http.get(this.url + '/approvalStatusData').subscribe((res) => {
      this.approvalStatusSubject.next(res);
    },
      (err) => { console.log(err); }
    );
  }

  sendApproval(data) {
    let link = '/approve';
    if (data.forward != undefined && data.forward == true) {
      link = '/forward';
    }
    const postData2 = new FormData();
    postData2.append('approvalData', JSON.stringify(data.approvalData));
    postData2.append('emailId', data.emailId);
    postData2.append('useremailId', data.approvalData.email);
    postData2.append('remarks', data.remarks);
    postData2.append("_id", data.approvalData._id)
    postData2.append('approvalId', data.approvalData.approvalId);
    if (data.file) {
      postData2.append('file', data.file, data.file.name);
    }
    postData2.append('zone', data.approvalData.zone);
    console.log("data:  ", data.approvalData);
    this.http.post(this.url + link, postData2).subscribe((res) => {
      this.approvalSubject.next(res);

    },
      (err) => {
        console.log(err);
        this.approvalSubject.next(err.error);
      }
    );
  }

  sendToCentral(data) {
    console.log("data in service", data)
    const postData2 = new FormData();
    postData2.append('approvalData', data.approvalData);
    postData2.append('emailId', data.emailId);
    postData2.append('remarks', data.remarks);
    if (data.po) {
      postData2.append('po', data.po);
    }
    if (data.file) {
      postData2.append('file', data.file, data.file.name);
    }
    postData2.append('approvalId', data.approvalData.approvalId);
    if (data.approvalData.claimId)
      postData2.append('claimId', data.approvalData.claimId);
    postData2.append('approval_type', data.approvalData.approval_type);
    postData2.append('subject', data.approvalData.subject);
    postData2.append('status', data.approvalData.status);
    postData2.append('amount_transferred', data.approvalData.amount_transferred);
    postData2.append('timeline', data.approvalData.timeline);
    postData2.append('_id', data.approvalData._id);
    postData2.append('zone', data.zone);
    this.http.post(this.url + '/approve/central', postData2).subscribe((res) => {
      this.approvalSubject.next('sentToCentralTrue');
    },
      (err) => {
        console.log(err);
        this.approvalSubject.next('sentToCentralFalse');
      }
    );
  }

  sendToAudit(data) {
    console.log("data in service", data)
    const postData2 = new FormData();
    postData2.append('approvalData', data.approvalData);
    postData2.append('emailId', data.emailId);
    postData2.append('remarks', data.remarks);
    if (data.po) {
      postData2.append('po', data.po);
    }
    if (data.file) {
      postData2.append('file', data.file, data.file.name);
    }
    postData2.append('approvalId', data.approvalData.approvalId);
    if (data.approvalData.claimId)
      postData2.append('claimId', data.approvalData.claimId);
    postData2.append('approval_type', data.approvalData.approval_type);
    postData2.append('subject', data.approvalData.subject);
    postData2.append('Current Status', data.approvalData.status);
    postData2.append('amount_transferred', data.approvalData.amount_transferred);
    postData2.append('timeline', data.approvalData.timeline);
    postData2.append('_id', data.approvalData._id);


    this.http.post(this.url + '/approve/audit', postData2).subscribe((res) => {
      this.approvalSubject.next('sentToAuditTrue');
    },
      (err) => {
        console.log(err);
        this.approvalSubject.next('sentToAuditFalse');
      }
    );
  }

  returnEditable(data) {
    //console.log("daat",data);
    const postData2 = new FormData();
    postData2.append('approvalData', data.approvalData);
    postData2.append('emailId', data.emailId);
    postData2.append('remarks', data.remarks);
    if (data.po) {
      postData2.append('po', data.po);
    }
    if (data.file) {
      postData2.append('file', data.file, data.file.name);
    }
    postData2.append('approvalId', data.approvalData.approvalId);
    if (data.approvalData.claimId)
      postData2.append('claimId', data.approvalData.claimId);
    postData2.append('approval_type', data.approvalData.approval_type);
    postData2.append('subject', data.approvalData.subject);
    postData2.append('status', data.approvalData.status);
    postData2.append('amount_transferred', data.approvalData.amount_transferred);
    postData2.append('timeline', data.approvalData.timeline);
    postData2.append('_id', data.approvalData._id);
    this.http.post(this.url + '/approve/editable', postData2).subscribe((res) => {
      this.approvalSubject.next('editableTrue');
    },
      (err) => {
        console.log(err);
        this.approvalSubject.next('editableFalse');
      }
    );
  }

  notifyInitiator(data) {
    //console.log("daat",data);
    const postData2 = new FormData();
    postData2.append('approvalData', data.approvalData);
    postData2.append('emailId', data.emailId);
    postData2.append('remarks', data.remarks);
    if (data.po) {
      postData2.append('po', data.po);
    }
    if (data.file) {
      postData2.append('file', data.file, data.file.name);
    }
    postData2.append('approvalId', data.approvalData.approvalId);
    if (data.approvalData.claimId)
      postData2.append('claimId', data.approvalData.claimId);
    postData2.append('approval_type', data.approvalData.approval_type);
    postData2.append('subject', data.approvalData.subject);
    postData2.append('status', data.approvalData.status);
    postData2.append('amount_transferred', data.approvalData.amount_transferred);
    postData2.append('timeline', data.approvalData.timeline);
    postData2.append('_id', data.approvalData._id);
    this.http.post(this.url + '/approve/notify', postData2).subscribe((res) => {
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
    this.http.delete(this.url + '/' + data.approvalId + '/' + data.approval_id + '/' + data.claim_Id).subscribe((res) => {
      this.approvalSubject.next('deleteTrue');
    },
      (err) => {
        console.log(err);
        this.approvalSubject.next('deleteFalse');
      }
    );
  }

  sendOTP(data) {
    this.http.get(this.url + `/otp/send/${data}`).subscribe((res: { uri: string }) => {
      this.otpURI = res.uri;
    },
      (err) => { console.log(err); }
    );
  }

  verifyOTP(otp) {
    const otpURI = this.otpURI;
    this.http.get(this.url + `/otp/verify/${otpURI}/${otp}`).subscribe((res: { uri: string }) => {
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

  getAllApprovalListener() {
    return this.allApprovalSubject.asObservable();
  }

  getAwardListener() {
    return this.awardSubject.asObservable();
  }

  getBillListener() {
    return this.billSubject.asObservable();
  }

  getSalaryListener() {
    return this.salarySubject.asObservable()
  }

  getUnutilizedamtListner() {
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
