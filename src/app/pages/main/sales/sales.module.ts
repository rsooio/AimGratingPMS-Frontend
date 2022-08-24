import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { AllorderComponent } from './allorder/allorder.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NzTableModule } from 'ng-zorro-antd/table';
import { OrdereditorComponent } from './ordereditor/ordereditor.component';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { ProducteditorComponent } from './producteditor/producteditor.component';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { A11yModule } from '@angular/cdk/a11y';
import { ClientComponent } from './client/client.component';
import { ClientpriceComponent } from './clientprice/clientprice.component';
import { OrdertypeinComponent } from './ordertypein/ordertypein.component'


@NgModule({
  declarations: [
    AllorderComponent,
    OrdereditorComponent,
    ProducteditorComponent,
    ClientComponent,
    ClientpriceComponent,
    OrdertypeinComponent
  ],
  imports: [
    CommonModule,
    SalesRoutingModule,
    NzTableModule,
    NzLayoutModule,
    NzButtonModule,
    NzDividerModule,
    NzPageHeaderModule,
    NzBreadCrumbModule,
    NzSpaceModule,
    NzDescriptionsModule,
    NzGridModule,
    NzStatisticModule,
    NzTypographyModule,
    NzAutocompleteModule,
    NzInputModule,
    NzIconModule,
    NzPopoverModule,
    NzSelectModule,
    FormsModule,
    NzEmptyModule,
    NzSwitchModule,
    A11yModule,
  ]
})
export class SalesModule { }
