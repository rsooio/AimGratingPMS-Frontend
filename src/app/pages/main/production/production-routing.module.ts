import { ColorComponent } from './color/color.component';
import { TextureComponent } from './texture/texture.component';
import { TechnologyComponent } from './technology/technology.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // { path: '', redirectTo: '/main/production/technologies' },
  { path: 'technologies', component: TechnologyComponent, data: { keep: true } },
  { path: 'technologies/:id', component: TextureComponent, data: { keep: true } },
  { path: 'technologies/:id/:texture', component: ColorComponent, data: { keep: true } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductionRoutingModule { }
