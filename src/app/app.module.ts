import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatTableModule, MatSortModule, MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatProgressSpinnerModule,
  MatTabsModule,
  MatSnackBarModule,
  MatSelectModule,
  MatDialogModule,
  MatTooltipModule,
  MatMenuModule,
  MatChipsModule,
} from '@angular/material';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { SettingsComponent } from './settings/settings.component';
import { ApprovalFormComponent } from './approval-form/approval-form.component';
import { HeaderComponent } from './header/header.component';
import { AuthInterceptor } from './service/auth-interceptor';
import { ApprovalListComponent } from './dashboard/approval-list/approval-list.component';
import { ApprovalListItemComponent } from './dashboard/approval-list/approval-list-item/approval-list-item.component';
import { ActionDialogComponent } from './dashboard/action-dialog/action-dialog.component';
import { UsersSettingComponent } from './settings/users-setting/users-setting.component';
import { ZonesSettingComponent } from './settings/zones-setting/zones-setting.component';
import { ApproversSettingComponent } from './settings/approvers-setting/approvers-setting.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { GetSingleApprovalComponent } from './get-single-approval/get-single-approval.component';
import { EditSingleApprovalComponent } from './edit-approval/edit-single-approval.component';
import { UtilizationDetailsComponent } from './approval-form/utilization-details/utilization-details.component';
import { SalaryDetailsComponent } from './approval-form/salary-details/salary-details.component';
import { VendorDetailsComponent } from './approval-form/vendor-details/vendor-details.component';
import { AwardDashboardComponent } from './award-dashboard/award-dashboard.component';
import { AwardListComponent } from './award-dashboard/award-list/award-list.component';
import { AwardListItemComponent } from './award-dashboard/award-list/award-list-item/award-list-item.component';
import { BillDashboardComponent } from './bill-dashboard/bill-dashboard.component';
import { BillListComponent } from './bill-dashboard/bill-list/bill-list.component';
import { BillListItemComponent } from './bill-dashboard/bill-list/bill-list-item/bill-list-item.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    SettingsComponent,
    ApprovalFormComponent,
    HeaderComponent,
    ApprovalListComponent,
    ApprovalListItemComponent,
    ActionDialogComponent,
    UsersSettingComponent,
    ZonesSettingComponent,
    ApproversSettingComponent,
    ConfirmDialogComponent,
    GetSingleApprovalComponent,
    EditSingleApprovalComponent,
    UtilizationDetailsComponent,
    SalaryDetailsComponent,
    VendorDetailsComponent,
    AwardDashboardComponent,
    AwardListComponent,
    AwardListItemComponent,
    BillDashboardComponent,
    BillListComponent,
    BillListItemComponent,
  ],
  imports: [
    DateRangePickerModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatTableModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    MatTabsModule,
    MatSnackBarModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTooltipModule,
    MatMenuModule,
    MatPaginatorModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  entryComponents: [ActionDialogComponent, ConfirmDialogComponent, UtilizationDetailsComponent, SalaryDetailsComponent, VendorDetailsComponent]
})
export class AppModule { }
