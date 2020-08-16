import { BillDashboardComponent } from './bill-dashboard/bill-dashboard.component';
import { AwardDashboardComponent } from './award-dashboard/award-dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SettingsComponent } from './settings/settings.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ApprovalFormComponent } from './approval-form/approval-form.component';
import { AuthGuard } from './service/auth.guard';
import { GetSingleApprovalComponent } from './get-single-approval/get-single-approval.component';

const routes: Routes = [
  { path: '', component: ApprovalFormComponent},
  { path: 'login', component: LoginComponent},
  { path: 'track', component: GetSingleApprovalComponent},
  { path: 'approve', component: GetSingleApprovalComponent},
  { path: 'award-dashboard', component: AwardDashboardComponent, canActivate: [AuthGuard]},
  { path: 'bill-dashboard', component: BillDashboardComponent, canActivate: [AuthGuard]},
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard]},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  { path: '**', component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {

}
