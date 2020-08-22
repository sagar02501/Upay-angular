import { ApprovalFormService } from './../../service/approval-form.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-award-list',
  templateUrl: './award-list.component.html',
  styleUrls: ['./award-list.component.css']
})
export class AwardListComponent implements OnInit {

  constructor(private awardService: ApprovalFormService,) {}
  
  ngOnInit() {
    this.token = this.route.snapshot.queryParams['token'];
    this.approvalId = this.route.snapshot.queryParams['id'];
  
    if (this.approvalId) {
      this.getAwardData();
    }
    this.approvalSubscription = this.approvalService.getApprovalListener().subscribe((res) => {
      if ((res as any).error_message) {
        this.openSnackBar((res as any).error_message, 'failure');
        return;
      }
      if ((res as any).message) {
        this.openSnackBar((res as any).message, 'success');
        this.approval = undefined;
        return;
      }
      this.approval = res;
      console.log(res);
      if (this.approval) {
        this.approvalCreatedDate = new Date(this.approval.date).toLocaleString();
        this.timeline = this.approval.timeline.split('\n');
      }
    });
  }

  getAwardData(trackflag:boolean = false) {
    this.approvalService.getSingleApproval(this.approvalId || this.trackId,this.claimId,trackflag);
  }

}
