import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-utilization-details',
  templateUrl: './utilization-details.component.html',
  styleUrls: ['./utilization-details.component.css']
})
export class UtilizationDetailsComponent implements OnInit {

  constructor() { }
  @Input() approval: number;
  ngOnInit() {
   
  }

}
