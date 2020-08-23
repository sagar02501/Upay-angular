import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-award-list-item',
  templateUrl: './award-list-item.component.html',
  styleUrls: ['./award-list-item.component.css']
})
export class AwardListItemComponent implements OnInit {
  
  constructor() {}
  @Input() award;
  @Input() awardList;

  ngOnInit() {
    console.log(this.award)
  }

}
