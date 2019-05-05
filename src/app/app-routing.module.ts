import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SettingsComponent } from './settings/settings.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ApprovalFormComponent } from './approval-form/approval-form.component';
import { AuthGuard } from './service/auth.guard';

const routes: Routes = [
  { path: '', component: ApprovalFormComponent},
  { path: 'login', component: LoginComponent},
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
