import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ApprovalFormService } from './../service/approval-form.service';
import { SettingsService } from './../service/settings.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { MatPaginator } from '@angular/material';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit, OnDestroy {
  start: any;
  end: any;
  sortDateAsc: any;

  constructor(public approvalFormService: ApprovalFormService, public settingsService: SettingsService, private snackBar: MatSnackBar) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;;
  private approvalSubscription: Subscription;
  private allApprovalSubscription: Subscription;
  private approvalStatusSubscription: Subscription;
  private approverSubscription: Subscription;
  private zoneSub: Subscription;
  approvalList;
  approverList;
  selectedApprovalData;
  openPopup = false;
  success = false;
  emailId;
  sortOrder = -1;
  count;
  totalCount;
  total = 0;
  searchText;
  sortBy;
  pageSize = 10;
  zonesList = [];
  zonefilters;
  statusfilters;
  approvaltypefilters;
  allApprovalData;
  sortApprovalInterval = null;

  ngOnInit() {
    console.log("NG Onint");
    this.approvalFormService.getApprovalStatusData();
    this.approvalFormService.getApproval();
    this.settingsService.getApproverList();
    this.settingsService.getZoneList();

    this.approvalStatusSubscription = this.approvalFormService.getApprovalStatusListener()
      .subscribe((res) => {
        if (res) {
          //Changed this.count to count to show count based on current list
          let count = res as any;
          count = JSON.parse(JSON.stringify(count.count));
          this.total = count.new + count.pending + count.transferred + count.rejected + count.approved;
          this.totalCount = count;
        }
      });
    this.zoneSub = this.settingsService.getZoneSubjectListener().subscribe((res) => {
      this.zonesList = res as any;
    });
    this.approvalSubscription = this.approvalFormService.getApprovalListener()
      .subscribe((res) => {
        if (typeof (res) !== 'string' && (res as any).isSuccess == undefined) {
          this.approvalList = res;
          //Show count based on current list
          this.count = { new: 0, pending: 0, rejected: 0, approved: 0, transferred: 0 };
          for (const approval of this.approvalList) {
            if (approval.status == "new") {
              this.count.new++
            } else if (approval.status == "pending") {
              this.count.pending++
            } else if (approval.status == "rejected") {
              this.count.rejected++
            } else if (approval.status == "approved") {
              this.count.approved++
            } else if (approval.status == "transferred") {
              this.count.transferred++
            }
          }
          console.log("this.approvalList", this.approvalList)
        } else {
          if (res === 'sentToCentralTrue') {
            this.success = true;
            this.openSnackBar('Approval sent to Central Zone');
          } else if (res === 'sentToCentralFalse') {
            this.success = false;
            this.openSnackBar('Approval could not be send to Central Zone');
          } else if (res === 'sentToApproverTrue') {
            this.success = true;
            this.openSnackBar('Approval sent to Zonal Approver');
          } else if (res === 'sentToApproverFalse') {
            this.success = false;
            this.openSnackBar('Approval could not be send to Zonal Approver and Please attach file with remark');
          } else if (res === 'sentToAuditTrue') {
            this.success = true;
            this.openSnackBar('Approval Audit Complete ');
          } else if (res === 'sentToAuditFalse') {
            this.success = false;
            this.openSnackBar('Approval Audit not Completed ');
          } else if (res === 'notifyTrue') {
            this.success = true;
            this.openSnackBar('Initiator Notified!');
          } else if (res === 'notifyFalse') {
            this.success = false;
            this.openSnackBar('Initiator could not be Notified and Please attach file with remark');
          } else if (res === 'editableTrue') {
            this.success = true;
            this.openSnackBar('Return approval to User!');
          } else if (res === 'editableFalse') {
            this.success = false;
            this.openSnackBar('approval could not be Return to User and Please attach file with remark');
          } else if (res === 'deleteTrue') {
            this.success = true;
            this.openSnackBar('Deleted successfully');
          } else if (res === 'deleteFalse') {
            this.success = false;
            this.openSnackBar('Error, could not delete');
          } else {
            this.success = (res as any).isSuccess;
            this.openSnackBar((res as any).message);
          }

          //this.approvalFormService.getApproval();
          this.sortApproval(this.searchText, this.sortBy, this.statusfilters, this.zonefilters, this.approvaltypefilters, this.pageSize, this.start, this.end, this.sortDateAsc);//Todo: reslove issue ,pass missing param
          this.approvalFormService.getApprovalStatusData();

        }

      });

    this.approverSubscription = this.settingsService.getApproverSubjectListener().subscribe((res) => {
      this.approverList = res;
    });

    this.sortApprovalInterval = setInterval(() => {
      this.sortApproval(this.searchText, this.sortBy, this.statusfilters, this.zonefilters, this.approvaltypefilters, this.pageSize, this.start, this.end, this.sortDateAsc)
    }, 300000)
  }


  sortApproval(searchText?, sortBy?, status?, zones?, approvaltype?, pageSize?, start?, end?, sortDateAsc?) {
    //if sortby exist sortOrder
    this.sortDateAsc = sortDateAsc;
    if (sortBy !== undefined)
      this.sortDateAsc === true ? this.sortOrder = -1 : this.sortOrder = 1;
    this.searchText = searchText;
    this.sortBy = sortBy;
    this.zonefilters = zones;
    this.statusfilters = status;
    this.approvaltypefilters = approvaltype;
    this.paginator.pageIndex = 0;


    this.start = start;
    this.end = end;
    console.log("dashboard " + this.start, this.end);
    console.log('filtering', start, end);
    this.approvalFormService.getApproval(searchText, sortBy, this.sortOrder, pageSize, 0, status, zones, approvaltype, start, end);

  }


  handleEvent(e) {
    if (e.send) {
      this.sendForApproval(e);
    } else if (e.notify) {
      this.notifyInitiator(e);
    } else if (e.editable) {
      this.returnEditable(e);
    } else if (e.audit) {
      this.sendForAudit(e);
    } else if (e.fundTransfer) {
      this.fundtransfer(e);
    } else if (e.delete) {
      this.deleteApproval(e);
    } else if (e.searchText || e.searchText === '' || e.sortBy || e.status || e.zones || e.status === '' || e.zones === '' || e.approvaltype || e.approvaltype === '' || e.start || e.end) {
      this.sortApproval(e.searchText, e.sortBy, e.status, e.zones, e.approvaltype, this.pageSize, e.start, e.end, e.sortDateAsc);
      console.log(e.start, e.end);

    } else if (e.sendToUpdate) {
      this.sendToUpdate(e);
    }
  }

  loadExcelData() {
    this.approvalFormService.getAllApproval(this.searchText, this.sortBy, this.sortOrder, Math.pow(10, 10), 0, this.statusfilters, this.zonefilters, this.approvaltypefilters);
    this.allApprovalSubscription = this.approvalFormService.getAllApprovalListener().subscribe((res) => {
      if (res) {
        this.allApprovalData = res;
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.allApprovalData);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, 'UPAY');
      }
    })
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().toLocaleDateString() + '_' + new Date().toLocaleTimeString() + EXCEL_EXTENSION);
  }

  pageChanged(e) {
    if (e.pageSize != this.pageSize) {
      this.paginator.pageIndex = 0;
      this.pageSize = e.pageSize;
    }
    this.approvalFormService.getApproval(this.searchText, this.sortBy, this.sortOrder, e.pageSize, e.pageIndex, this.statusfilters, this.zonefilters, this.approvaltypefilters);
  }

  sendForApproval(e) {

    if (e.approval_id) {
      this.approvalFormService.sendToCentral(e);
    } else {
      this.approvalFormService.sendApproval(e);
    }
  }

  sendToUpdate(e) {
    this.approvalFormService.sendToUpdate(e)
  }

  sendForAudit(e) {
    console.log("this.approval e", e);
    this.approvalFormService.sendToAudit(e);
  }
  //@akshay retun code start

  returnEditable(e) {
    this.approvalFormService.returnEditable(e);
  }

  //@akshay retrun code end

  notifyInitiator(e) {
    this.approvalFormService.notifyInitiator(e);
  }

  fundtransfer(e) {
    console.log("fund transfer", e);
    this.approvalFormService.fundTransfer(e);
  }

  deleteApproval(e) {
    this.approvalFormService.deleteApproval(e);
  }

  openSnackBar(message) {
    this.snackBar.open(message, null, {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: this.success ? 'success' : 'failure'
    });
  }

  ngOnDestroy() {
    this.approvalSubscription.unsubscribe();
    this.approverSubscription.unsubscribe();
    //this.allApprovalSubscription.unsubscribe();
    this.zoneSub.unsubscribe();
    clearInterval(this.sortApprovalInterval);
  }
}
