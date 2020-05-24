import { Component, OnInit, OnDestroy } from '@angular/core';
import { SettingsService } from '../../service/settings.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from './../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-approvers-setting',
  templateUrl: './approvers-setting.component.html',
  styleUrls: ['./approvers-setting.component.css']
})
export class ApproversSettingComponent implements OnInit, OnDestroy {

  isLoading = false;
  
  private approverSub: Subscription;
  approvers = [];
  private zoneSub: Subscription;
  zones = [];
  constructor(public settingsService: SettingsService, private dialog: MatDialog) { }

  ngOnInit() {
    this.settingsService.getApproverList();

    this.zoneSub = this.settingsService.getZoneSubjectListener().subscribe((res) => {
      this.zones = res as any;
    });

    this.approverSub = this.settingsService.getApproverSubjectListener().subscribe((res) => {
      this.approvers = res as any;
      this.isLoading = false;
    });
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.settingsService.addApprover(form.value.email, form.value.zone);
  }

  editApprover(id, email, zone) {
    this.settingsService.editApprover(id, email, zone);
  }

  deleteApprover(id) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        header: 'Delete',
        message: 'Are you sure you want to delete this approver?',
        buttonTextPrimary: 'Delete',
        buttonTextSecondary: 'Cancel'
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.settingsService.deleteApprover(id);
      }
    });
  }

  ngOnDestroy() {
    this.zoneSub.unsubscribe();
    this.approverSub.unsubscribe();
  }
}
