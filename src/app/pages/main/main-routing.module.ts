import { MainComponent } from './main.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', component: MainComponent, children: [
      { path: '', redirectTo: "sales/allorder", data: { keep: true } },
      { path: 'dashboard', loadChildren: () => import('@/pages/main/dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'sales', loadChildren: () => import('@/pages/main/sales/sales.module').then(m => m.SalesModule) },
      { path: 'production', loadChildren: () => import('@/pages/main/production/production.module').then(m => m.ProductionModule) },
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
export class MainRoutingModule { }
