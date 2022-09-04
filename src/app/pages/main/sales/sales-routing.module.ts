import { OrdertypeinComponent } from './ordertypein/ordertypein.component';
import { ClientpriceComponent } from './clientprice/clientprice.component';
import { ClientComponent } from './client/client.component';
import { ProducteditorComponent } from './producteditor/producteditor.component';
import { OrdereditorComponent } from './ordereditor/ordereditor.component';
import { AllorderComponent } from './allorder/allorder.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'orders', component: AllorderComponent, data: { keep: true } },
  { path: 'orders/:id', component: OrdereditorComponent, data: { keep: true } },
  // { path: 'orders/:id/:setid', component: ProducteditorComponent, data: { keep: true } },
  { path: 'typein', component: OrdertypeinComponent, data: { keep: true } },
  { path: 'typein/:id', component: OrdereditorComponent, data: { keep: true } },
  // { path: 'typein/:id/:setid', component: ProducteditorComponent, data: { keep: true } },
  { path: 'clients', component: ClientComponent, data: { keep: true } },
  { path: 'clients/:client', component: ClientpriceComponent, data: { keep: true } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
