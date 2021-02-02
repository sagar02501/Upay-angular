import { Component, OnInit } from '@angular/core';
import { ApprovalFormService } from './../../service/approval-form.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-award-list',
  templateUrl: './award-list.component.html',
  styleUrls: ['./award-list.component.css']
})
export class AwardListComponent implements OnInit {
  approvalId;
  awardList;
  timeline;
  awardCreatedDate;

  private awardSubscription: Subscription;
  constructor(private awardService: ApprovalFormService,
    private approvalService: ApprovalFormService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar) {}
  
  ngOnInit() {
    this.approvalId = this.route.snapshot.queryParams['id'];
  
    if (this.approvalId) {
      this.getAwardData();
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
      if (this.awardList) {
        this.awardCreatedDate = new Date(this.awardList.date).toLocaleString();
        //this.timeline = this.awardList.timeline.split('\n');
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

  getAwardData() {
    this.approvalService.getAwardApproval(this.approvalId);
  }

}

