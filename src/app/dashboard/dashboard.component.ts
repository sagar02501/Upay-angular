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
  total = 0;
  searchText;
  sortBy;
  pageSize = 10;
  zonesList = [];
  zonefilters;
  statusfilters;
  approvaltypefilters;
  allApprovalData;

  ngOnInit() {
    this.approvalFormService.getApprovalStatusData();
    this.approvalFormService.getApproval();
    this.settingsService.getApproverList();
    this.settingsService.getZoneList();
    
    this.approvalStatusSubscription = this.approvalFormService.getApprovalStatusListener()
    .subscribe((res) => {
      if (res) {
        this.count = res;
        this.count = JSON.parse(JSON.stringify(this.count.count));
        this.total = this.count.new + this.count.pending + this.count.transferred + this.count.rejected + this.count.approved;
      }
    });
    this.zoneSub = this.settingsService.getZoneSubjectListener().subscribe((res) => {
      this.zonesList = res as any;
    });
    this.approvalSubscription = this.approvalFormService.getApprovalListener()
    .subscribe((res) => {
      if (typeof(res) !== 'string' && (res as any).isSuccess == undefined) {
        this.approvalList = res;
        console.log("this.approvalList",this.approvalList)
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
          this.openSnackBar('Approval could not be send to Zonal Approver');
        } else if (res === 'notifyTrue') {
          this.success = true;
          this.openSnackBar('Initiator Notified!');
        } else if (res === 'notifyFalse') {
          this.success = false;
          this.openSnackBar('Initiator could not be Notified!');
        } else {
          this.success = (res as any).isSuccess;
          this.openSnackBar((res as any).message);
        }
        setTimeout(() => { this.approvalFormService.getApproval();
                      this.approvalFormService.getApprovalStatusData();
                    }, 500);
      }
      
    });

    this.approverSubscription = this.settingsService.getApproverSubjectListener().subscribe((res) => {
      this.approverList = res;
    });
  }

  sortApproval(searchText?, sortBy?,status?, zones?,approvaltype?, pageSize?) {
    this.sortOrder === 1 ? this.sortOrder = -1 : this.sortOrder = 1;
    this.searchText = searchText;
    this.sortBy = sortBy;
    this.zonefilters = zones;
    this.statusfilters = status;
    this.approvaltypefilters =approvaltype;
    this.paginator.pageIndex = 0;
    //console.log('filtering',status,zones)
    this.approvalFormService.getApproval(searchText, sortBy, this.sortOrder, pageSize,0,status,zones,approvaltype);


  }


  handleEvent(e) {
    if (e.send) {
      this.sendForApproval(e);
    } else if (e.notify) {
      this.notifyInitiator(e);
    } else if (e.fundTransfer) {
      this.fundtransfer(e);
    } else if (e.delete) {
      this.deleteApproval(e);
    } else if (e.searchText || e.searchText === '' || e.sortBy || e.status || e.zones || e.status === '' || e.zones ==='' || e.approvaltype || e.approvaltype === '' ) {
      this.sortApproval(e.searchText, e.sortBy, e.status, e.zones,e.approvaltype , this.pageSize);
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
    const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
    FileSaver.saveAs(data, fileName + '_export_' + new Date().toLocaleDateString() + '_' + new  Date().toLocaleTimeString() + EXCEL_EXTENSION);
 }

  pageChanged(e) {
    if (e.pageSize != this.pageSize) {
      this.paginator.pageIndex = 0;
      this.pageSize = e.pageSize;
    }
    this.approvalFormService.getApproval(this.searchText, this.sortBy, this.sortOrder, e.pageSize, e.pageIndex,this.statusfilters,this.zonefilters,this.approvaltypefilters);
  }

  sendForApproval(e) {
    console.log("this.approval e",e);
    if (e.approvalId) {
      this.approvalFormService.sendToCentral(e);
    } else {
      this.approvalFormService.sendApproval(e);
    }
  }

  notifyInitiator(e) {
      this.approvalFormService.notifyInitiator(e);
  }

  fundtransfer(e) {
    console.log("fund transfer" , e);
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
    this.allApprovalSubscription.unsubscribe();
    this.zoneSub.unsubscribe();
  }
}
