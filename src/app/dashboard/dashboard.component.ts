import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ApprovalFormService } from './../service/approval-form.service';
import { SettingsService } from './../service/settings.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit, OnDestroy {

  constructor(public approvalFormService: ApprovalFormService, public settingsService: SettingsService, private snackBar: MatSnackBar) { }

  private approvalSubscription: Subscription;
  private approverSubscription: Subscription;
  approvalList;
  approverList;
  selectedApprovalData;
  openPopup = false;
  success = false;
  emailId;
  sortOrder = 1;

  ngOnInit() {
    this.approvalFormService.getApproval();
    this.settingsService.getApproverList();

    this.approvalSubscription = this.approvalFormService.getApprovalListener()
    .subscribe((res) => {
      if (typeof(res) !== 'string') {
        this.approvalList = res;
      } else {
        if (res === 'sentToCentralTrue') {
          this.success = true;
          this.openSnackBar('Approval sent to Central Zone');
          this.approvalFormService.getApproval();
        } else if (res === 'sentToCentralFalse') {
          this.success = false;
          this.openSnackBar('Approval could not be send to Central Zone');
        } else if (res === 'sentToApproverTrue') {
          this.success = true;
          this.openSnackBar('Approval sent to Zonal Approver');
          this.approvalFormService.getApproval();
        } else if (res === 'sentToApproverFalse') {
          this.success = false;
          this.openSnackBar('Approval could not be send to Zonal Approver');
        }
      }
    });

    this.approverSubscription = this.settingsService.getApproverSubjectListener().subscribe((res) => {
      this.approverList = res;
    });
  }

  sortApproval(searchText?, sortBy?) {
    this.sortOrder === 1 ? this.sortOrder = -1 : this.sortOrder = 1;
    this.approvalFormService.getApproval(searchText, sortBy, this.sortOrder);
  }

  handleEvent(e) {
    if (e.send) {
      this.sendForApproval(e);
    }
    if (e.searchText || e.searchText === '' || e.sortBy) {
      this.sortApproval(e.searchText, e.sortBy);
    }
  }

  sendForApproval(e) {
    if (e.approvalId) {
      this.approvalFormService.sendToCentral(e);
    } else {
      this.approvalFormService.sendApproval(e);
    }

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
  }
}
