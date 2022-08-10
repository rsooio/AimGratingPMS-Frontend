import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsProviderModule } from '@/icons-provider.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

import { MainComponent } from './main.component';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    MainComponent,
  ],
  imports: [
    CommonModule,
    NzMenuModule,
    NzLayoutModule,
    RouterModule,
    IconsProviderModule,
    // BrowserAnimationsModule,
    // FormsModule,
    // BrowserModule
  ]
})
export class MainModule { }
