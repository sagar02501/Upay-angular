import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-salary-details',
  templateUrl: './salary-details.component.html',
  styleUrls: ['./salary-details.component.css']
})
export class SalaryDetailsComponent implements OnInit {

  constructor() { }
  onsalaryImagePicked(event: Event,index:number) {
    console.log(index);
   this.salaries[index].file = (event.target as HTMLInputElement).files[0];
 }
 removesalaryItem(index:number){
   this.salaries.splice(index,1);
 }

  @Input() approval: number;
  @Input() salaries;
  @Input() salary;
  @Input() b;
  ngOnInit() {
   
  }

}
