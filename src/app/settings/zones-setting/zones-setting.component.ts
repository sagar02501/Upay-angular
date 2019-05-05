import { Component, OnInit, OnDestroy } from '@angular/core';
import { SettingsService } from '../../service/settings.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from './../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-zones-setting',
  templateUrl: './zones-setting.component.html',
  styleUrls: ['./zones-setting.component.css']
})
export class ZonesSettingComponent implements OnInit, OnDestroy {

  isLoading = false;

  private zoneSub: Subscription;
  zones = [];

  constructor(public settingsService: SettingsService, private dialog: MatDialog) { }

  ngOnInit() {
    this.settingsService.getZoneList();

    this.zoneSub = this.settingsService.getZoneSubjectListener().subscribe((res) => {
      this.zones = res as any;
      this.isLoading = false;
    });
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.settingsService.addZone(form.value.zone);
  }

  editZone(id, name) {
    this.settingsService.editZone(id, name);
  }

  deleteZone(id) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        header: 'Delete',
        message: 'Are you sure you want to delete this zone?',
        buttonTextPrimary: 'Delete',
        buttonTextSecondary: 'Cancel'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.settingsService.deleteZone(id);
      }
    });
  }


  ngOnDestroy() {
    this.zoneSub.unsubscribe();
  }
}

