import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-salary-details',
  templateUrl: './salary-details.component.html',
  styleUrls: ['./salary-details.component.css']
})
export class SalaryDetailsComponent implements OnInit {

  constructor() { }
  @Input() approval: number;
  ngOnInit() {
   
  }

}
