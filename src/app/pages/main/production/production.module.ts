import { A11yModule } from '@angular/cdk/a11y';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductionRoutingModule } from './production-routing.module';
import { TechnologyComponent } from './technology/technology.component';

import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { TextureComponent } from './texture/texture.component';
import { ColorComponent } from './color/color.component';


@NgModule({
  declarations: [
    TechnologyComponent,
    TextureComponent,
    ColorComponent
  ],
  imports: [
    CommonModule,
    ProductionRoutingModule,
    FormsModule,
    NzLayoutModule,
    NzPageHeaderModule,
    NzBreadCrumbModule,
    NzTypographyModule,
    NzStatisticModule,
    NzSpaceModule,
    NzSelectModule,
    NzTableModule,
    NzDividerModule,
    NzButtonModule,
    NzInputModule,
    A11yModule
  ]
})
export class ProductionModule { }
