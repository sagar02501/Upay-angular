import { Component, OnInit, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material';
@Component({
  selector: 'app-vendor-details',
  templateUrl: './vendor-details.component.html',
  styleUrls: ['./vendor-details.component.css']
})
export class VendorDetailsComponent implements OnInit {
  constructor(private snackBar: MatSnackBar) { }
  onvendorImagePicked(event: Event, index: number) {
    this.vendors[index].file = (event.target as HTMLInputElement).files[0];
    if (this.vendors[index].file.size > 10485760) {
      this.vendors[index].file = null
      this.snackBar.open("File size should be less than 10MB", null, {
        duration: 5000,
        verticalPosition: 'top',
        panelClass: 'failure'
      });
    }
  }
  removevendorItem(index: number) {
    this.vendors.splice(index, 1);
  }
  @Input() approval: number;
  @Input() vendors;
  @Input() vendor;
  @Input() b;
  ngOnInit() {

  }
}
