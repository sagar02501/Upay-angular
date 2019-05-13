import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-approval-list',
  templateUrl: './approval-list.component.html',
  styleUrls: ['./approval-list.component.css']
})
export class ApprovalListComponent implements OnInit {

  constructor() { }
  @Input() approvalList;
  @Input() approverList;
  openBody = false;
  @Output() actionOccured: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
  }

  handleEvent(e) {
    this.actionOccured.emit(e);
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
        overflow-y: scroll;
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

}
