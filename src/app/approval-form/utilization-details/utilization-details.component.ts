import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-utilization-details',
  templateUrl: './utilization-details.component.html',
  styleUrls: ['./utilization-details.component.css']
})
export class UtilizationDetailsComponent implements OnInit {

  constructor() { }
   onbillImagePicked(event: Event,index:number) {
     console.log(index);
    this.bills[index].file = (event.target as HTMLInputElement).files[0];
  }
  removebillItem(index:number){
    this.bills.splice(index,1);
  }
  @Input() approval: number;
  @Input() bills;
  @Input() bill;
  @Input() b;
  ngOnInit() {
   
  }

}
