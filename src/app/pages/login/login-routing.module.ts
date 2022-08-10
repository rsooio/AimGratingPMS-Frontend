import { RegisterComponent } from './register/register.component';
import { StafferComponent } from './staffer/staffer.component';
import { LoginComponent } from './login.component';
import { Routes, RouterModule, Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { EnterpriseComponent } from '@/pages/login/enterprise/enterprise.component';

const routes: Routes = [
  {
    path: '', component: LoginComponent, children: [
      { path: '', redirectTo: "staffer" },
      { path: 'enterprise', component: EnterpriseComponent, data: { animation: 'enterprise' } },
      { path: 'staffer', component: StafferComponent, data: { animation: 'staffer' } },
      { path: 'register', component: RegisterComponent, data: { animation: 'register' } }
    ]
  },
  // { path: '', redirectTo: "staffer" },
  // { path: 'enterprise', component: EnterpriseComponent, data: { animation: 'enterprise' } },
  // { path: 'staffer', component: StafferComponent, data: { animation: 'staffer' } },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class LoginRoutingModule { }
