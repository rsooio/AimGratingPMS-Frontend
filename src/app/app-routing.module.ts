import { SimpleReuseStrategy } from '@/strategy/SimpleReuseStrategy';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, RouteReuseStrategy } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login/enterprise' },
  { path: 'login', loadChildren: () => import('@/pages/login/login.module').then(m => m.LoginModule) },
  { path: 'main', loadChildren: () => import('@/pages/main/main.module').then(m => m.MainModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: SimpleReuseStrategy }
  ]
})
export class AppRoutingModule { }
