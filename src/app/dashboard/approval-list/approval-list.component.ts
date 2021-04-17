import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { NgForm} from '@angular/forms';


@Component({
  selector: 'app-approval-list',
  templateUrl: './approval-list.component.html',
  styleUrls: ['./approval-list.component.css']
})



export class ApprovalListComponent implements OnInit {
  public start: Date = new Date ("07/07/2020"); 
    public end: Date = new Date ("07/08/2020");
  constructor() { }
  selectedStatus;
  selectedZone;
  selectedApprovalType;
  @Input() approvalList;
  @Input() approverList;
  @Input() zonesList;
  @Input() allApprovalData;
  openBody = false;
  searchText;
  sortBy;
  sortAmountAsc = true;
  sortDateAsc = true;
  approvalSearchSubject = new Subject();
  @Output() actionOccured: EventEmitter<any> = new EventEmitter()
  @Output() exportExcelFired: EventEmitter<any> = new EventEmitter()
  
  status ='';
  zones ='';
  approvaltype = '';
  openedChange(opened: boolean) {
    
    if(opened == true){ console.log('selecting zone or status');}
    else{
      if( (this.selectedStatus instanceof Array ) && this.selectedStatus.length >= 0 )
         {
          this.status = this.selectedStatus.toString();
          //console.log(this.selectedStatus.toString())
         }
      if( (this.selectedZone instanceof Array ) && this.selectedZone.length >= 0 )
         {
          this.zones = this.selectedZone.toString();
         // console.log(this.selectedZone.toString())
         } 

         if( (this.selectedApprovalType instanceof Array ) && this.selectedApprovalType.length >= 0 )
         {
          this.approvaltype = this.selectedApprovalType.toString();
         // console.log(this.selectedZone.toString())
         } 
         //console.log(zones + ' , '+ status)
         this.filterApproval(this.zones,this.status,this.approvaltype);
     }
    
 }
  ngOnInit() {
    this.approvalSearchSubject.pipe(debounceTime(500)).subscribe((e) => {
      this.sortApproval();
    });
  }


  handleEvent(e) {
    this.actionOccured.emit(e);
  }

  searchApproval() {
    this.approvalSearchSubject.next();
  }

  sortApproval(sortBy?) {
    this.sortBy = sortBy;
    if (sortBy === 'date') {
      this.sortDateAsc ? this.sortDateAsc = false : this.sortDateAsc = true;
    }
    if (sortBy === 'amount') {
      this.sortAmountAsc ? this.sortAmountAsc = false : this.sortAmountAsc = true;
    }
    this.filterApproval(this.zones,this.status,this.approvaltype);
    //this.actionOccured.emit({searchText: this.searchText, sortBy: sortBy,status: this.selectedStatus instanceof Array  ? this.selectedStatus.toString():'', zones:  this.selectedZone instanceof Array ? this.selectedZone.toString():''});
  }

  filterApproval(zone?,status?,approvaltype?) {
   // console.log('filterEmit', zone, status)
    this.actionOccured.emit({searchText: this.searchText, sortBy: this.sortBy !== undefined? this.sortBy :'date' ,status: status, zones: zone,approvaltype:approvaltype});
  }

  openBodyAndCreatePdf() {
    this.openBody = true;
    setTimeout(() => {
      this.createPDF();
      this.openBody = false;
    }, 100);
  }

  createPDF() {
    const approvalList = document.getElementsByClassName('a-table')[0].innerHTML;

    const style = `<style>
    html {
      font-size: 10px !important;
    }
    .approvals-table {
      display: flex;
      margin: 20px;
      min-width: 1000px;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      box-shadow: 1px 1px 10px 0 #cfd8dc;
      font-family: 'Rubik', sans-serif;
    }
    .approvals-table__header {
        height: 40px;
        width: 100%;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(1rem, 1fr));
        align-items: center;
        justify-items: center;
        font-size: 1.2rem;
        background-color: #eff2f7;
        font-weight: 700;
    }
        .approvals-table__header div {
          cursor: pointer;
        }
        .approvals-table__header div:hover i {
          opacity: 1;
        }
        .approvals-table__header  i {
          font-size: 7px;
          display: inline-block;
          opacity: 0;
          color: rgba(0,0,0,.54);
          transition: opacity 0.2s, transform 0.5s ease-in-out;
        }
      .approvals-table__body {
        background: #fff;
        width: 100%;
        overflow-y: auto;
        border-bottom: 2px solid #e6e6e6;
      }
      .approvals-table__footer {
        height: 75px;
        display: flex;
        justify-content: flex-end;
        background: #fff;
        width: 100%;
      }
      .approvals-list__item {
        height: 35px;
        width: 100%;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(1rem, 1fr));
        align-items: center;
        justify-items: center;
        font-size: 1.2rem;
        border-bottom: 1px solid #e6e6e6;
    }
    .approvals-list__item > div {
      word-break: break-all;
    }
    .approval-body-item {
      padding: 1rem 7rem;
      border-bottom: 1px solid #e6e6e6;
      font-size: 1.2rem;
    }
    .approval-body {
      cursor: pointer;
      display: flex;
      align-items: center;
    }
    .approval-status {
      display: flex;
      align-items: center;
    }
    .remarks-icon {
      height: 12px;
      width: 12px;
      margin-left: 3px;
      background-color: black;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-size: 1rem;
      font-family: sans-serif;
    }
    .approved {
      color: #4caf50;
    }
    .rejected {
      color: #f03434;
    }
    .approval-action {
      display: none;
    }
      </style>`;

    const win = window.open('', '', 'height=700,width=700');

    win.document.write('<html><head>');
    win.document.write('<title>Approvals List</title>');
    win.document.write(style);
    win.document.write('</head>');
    win.document.write('<body>');
    win.document.write(approvalList);
    win.document.write('</body></html>');

    win.document.close();

    win.print();
}

createExcelReport() {
  this.exportExcelFired.emit(true);
}

}
