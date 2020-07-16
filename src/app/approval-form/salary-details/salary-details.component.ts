import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-salary-details',
  templateUrl: './salary-details.component.html',
  styleUrls: ['./salary-details.component.css']
})
export class SalaryDetailsComponent implements OnInit {

  constructor() { }
  onbillImagePicked(event: Event,index:number) {
    console.log(index);
   this.salary[index].file = (event.target as HTMLInputElement).files[0];
 }
  @Input() approval: number;
  @Input() salaries;
  @Input() salary;
  ngOnInit() {
   
  }

}
