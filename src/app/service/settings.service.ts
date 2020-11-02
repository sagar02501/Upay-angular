import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }
  url = environment.backendURL + 'api/';
  private zoneSubject = new Subject();
  private approverSubject = new Subject();

  getZoneList() {
    this.http.get(this.url + 'zone').subscribe((res) => {
      this.zoneSubject.next(res);
    },
    (err) => {console.log(err); }
    );
  }

  addZone(zone) {
    const data = {name: zone};
    this.http.post(this.url + 'zone/create', data).subscribe((res) => {
      this.openSnackBar((res as any).message, 1);
    },
    (err) => {
      this.openSnackBar(err.error.message, 0);
    }
   );
   setTimeout(() => this.getZoneList(), 1000);
  }

  editZone(id, name) {
    const data = {id: id, name: name};
    this.http.post(this.url + 'zone/edit', data).subscribe((res) => {
      this.openSnackBar((res as any).message, 1);
    },
    (err) => {
      this.openSnackBar(err.error.message, 0);
    }
   );
   setTimeout(() => this.getZoneList(), 1000);
  }

  deleteZone(id) {
    this.http.delete(this.url + 'zone/' + id).subscribe((res) => {
      this.openSnackBar((res as any).message, 1);
    },
    (err) => {
      this.openSnackBar(err.error.message, 0);
    }
   );
   setTimeout(() => this.getZoneList(), 1000);
  }

  getZoneSubjectListener() {
    return this.zoneSubject.asObservable();
  }

  getApproverList(forward = "false") {
    
    if(forward == 'true'){
      this.http.get(this.url + 'approver/forward').subscribe((res) => {
        this.approverSubject.next(res);
      },
      (err) => {console.log(err); }
      );
    }else{
      this.http.get(this.url + 'approver').subscribe((res) => {
        this.approverSubject.next(res);
      },
      (err) => {console.log(err); }
      );
    }
    
    
  }

  addApprover(email, zone) {
    const data = {email: email, zone: zone};
    this.http.post(this.url + 'approver/create', data).subscribe((res) => {
      this.openSnackBar((res as any).message, 1);
    },
    (err) => {
      this.openSnackBar(err.error.message, 0);
    }
   );
   setTimeout(() => this.getApproverList(), 1000);
  }

  editApprover(id, email, zone) {
    const data = {id: id, email: email, zone: zone};
    this.http.post(this.url + 'approver/edit', data).subscribe((res) => {
      this.openSnackBar((res as any).message, 1);
    },
    (err) => {
      this.openSnackBar(err.error.message, 0);
    }
   );
   setTimeout(() => this.getApproverList(), 1000);
  }

  deleteApprover(id) {
    this.http.delete(this.url + 'approver/' + id).subscribe((res) => {
      this.openSnackBar((res as any).message, 1);
    },
    (err) => {
      this.openSnackBar(err.error.message, 0);
    }
   );
   setTimeout(() => this.getApproverList(), 1000);
  }

  getApproverSubjectListener() {
    return this.approverSubject.asObservable();
  }

  openSnackBar(message, status) {
    this.snackBar.open(message, null, {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: status ? 'success' : 'failure'
    });
  }
}
