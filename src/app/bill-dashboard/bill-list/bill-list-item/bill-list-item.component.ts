import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-bill-list-item',
  templateUrl: './bill-list-item.component.html',
  styleUrls: ['./bill-list-item.component.css']
})
export class BillListItemComponent implements OnInit {

  constructor() { }
  @Input() bill;

  ngOnInit() {
    console.log(this.bill)
  }

}
