import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-action-dialog',
  templateUrl: './action-dialog.component.html',
  styleUrls: ['./action-dialog.component.css']
})
export class ActionDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  approverList = [];
  title = '';
  to;

  ngOnInit() {
    console.log(this.data.approverList);
    this.approverList = this.data.approverList;
    this.title = this.data.title;
    this.to = this.data.to || 'Approver';
  }

}
