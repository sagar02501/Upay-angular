import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-approval-list',
  templateUrl: './approval-list.component.html',
  styleUrls: ['./approval-list.component.css']
})
export class ApprovalListComponent implements OnInit {

  constructor() { }
  @Input() approvalList;
  @Input() approverList;
  @Output() actionOccured: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
  }

  handleEvent(e) {
    this.actionOccured.emit(e);
  }

}
