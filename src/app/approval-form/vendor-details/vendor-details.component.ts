import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-vendor-details',
  templateUrl: './vendor-details.component.html',
  styleUrls: ['./vendor-details.component.css']
})
export class VendorDetailsComponent implements OnInit {
  constructor() { }
  onvendorImagePicked(event: Event,index:number) {
    console.log(index);
   this.vendors[index].file = (event.target as HTMLInputElement).files[0];
  }
  @Input() approval: number;
  @Input() vendors;
  @Input() vendor;
  @Input() b;
  ngOnInit() {
   
  }
}
