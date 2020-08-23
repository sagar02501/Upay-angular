import { Component, OnInit } from '@angular/core';
import { ApprovalFormService } from './../../service/approval-form.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bill-list',
  templateUrl: './bill-list.component.html',
  styleUrls: ['./bill-list.component.css']
})
export class BillListComponent implements OnInit {

  claimId;
  billList;
  timeline;
  billCreatedDate;

  private billSubscription: Subscription;
  constructor(private awardService: ApprovalFormService,
    private approvalService: ApprovalFormService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar) {}
  
  ngOnInit() {
    this.claimId = this.route.snapshot.queryParams['id'];
  
    if (this.claimId) {
      this.getBillData();
    }
    this.billSubscription = this.approvalService.getBillListener().subscribe((res) => {
      if ((res as any).error_message) {
        this.openSnackBar((res as any).error_message, 'failure');
        return;
      }
      if ((res as any).message) {
        this.openSnackBar((res as any).message, 'success');
        this.billList = undefined;
        return;
      }
      this.billList = res;
      console.log(res);
      if (this.billList) {
        this.billCreatedDate = new Date(this.billList.date).toLocaleString();
        this.timeline = this.billList.timeline.split('\n');
      }
    });
  }
  openSnackBar(message, type) {
    this.snackBar.open(message, null, {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: type
    });
  }

  getBillData() {
    this.approvalService.getBillApproval(this.claimId);
  }

}

