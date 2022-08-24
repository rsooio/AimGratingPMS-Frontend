import { StafferGuard } from './staffer/staffer.guard';
import { SimpleReuseStrategy } from './../../strategy/SimpleReuseStrategy';
import { RegisterComponent } from './register/register.component';
import { StafferComponent } from './staffer/staffer.component';
import { LoginComponent } from './login.component';
import { Routes, RouterModule, Router, RouteReuseStrategy } from '@angular/router';
import { NgModule } from '@angular/core';
import { EnterpriseComponent } from '@/pages/login/enterprise/enterprise.component';

const routes: Routes = [
  {
    path: '', component: LoginComponent, children: [
      { path: '', redirectTo: "enterprise", data: { keep: true } },
      { path: 'enterprise', component: EnterpriseComponent, data: { animation: 'enterprise', keep: true } },
      { path: 'staffer', component: StafferComponent, data: { animation: 'staffer', keep: true, name: null }, canActivate: [StafferGuard] },
      { path: 'register', component: RegisterComponent, data: { animation: 'register', keep: true } }
    ]
  },
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
