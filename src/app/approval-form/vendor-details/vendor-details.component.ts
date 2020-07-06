import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-vendor-details',
  templateUrl: './vendor-details.component.html',
  styleUrls: ['./vendor-details.component.css']
})
export class VendorDetailsComponent implements OnInit {

  constructor() { }
  @Input() approval: number;
  ngOnInit() {
   
  }

}
