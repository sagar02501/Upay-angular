import { Component, OnInit, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material';
@Component({
  selector: 'app-utilization-details',
  templateUrl: './utilization-details.component.html',
  styleUrls: ['./utilization-details.component.css']
})
export class UtilizationDetailsComponent implements OnInit {

  constructor(private snackBar: MatSnackBar) { }
  onbillImagePicked(event: Event, index: number) {
    this.bills[index].file = (event.target as HTMLInputElement).files[0];
    if (this.bills[index].file.size > 10485760) {
      this.bills[index].file = null
      this.snackBar.open("File size should be less than 10MB", null, {
        duration: 5000,
        verticalPosition: 'top',
        panelClass: 'failure'
      });
    }
  }
  removebillItem(index: number) {
    this.bills.splice(index, 1);
  }
  @Input() approval: number;
  @Input() bills;
  @Input() bill;
  @Input() b;
  ngOnInit() {

  }

}
