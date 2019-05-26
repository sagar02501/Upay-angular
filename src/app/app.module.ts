import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {MatTableModule, MatSortModule} from '@angular/material';
import { MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatProgressSpinnerModule,
  MatTabsModule,
  MatSnackBarModule,
  MatSelectModule,
  MatDialogModule,
  MatTooltipModule,
  MatMenuModule
 } from '@angular/material';

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
  ],
  imports: [
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
    MatMenuModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  entryComponents: [ActionDialogComponent, ConfirmDialogComponent]
})
export class AppModule { }
