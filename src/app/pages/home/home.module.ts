import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { QuillModule } from 'ngx-quill'
import { SharedModule } from '../../shared/shared.module';
import { PipesModule } from '../../theme/pipes/pipes.module';
import { HomeComponent } from './home.component';
import { PerfilComponent } from './perfil/perfil.component';
import { NgxSmartModalModule, NgxSmartModalService } from 'ngx-smart-modal';
import { APP } from 'src/app/services/constants';

export const routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'perfil', component: PerfilComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    QuillModule,
    SharedModule,
    PipesModule,
    NgxSmartModalModule
  ],
  declarations: [
    HomeComponent,
    PerfilComponent
  ],
  providers: [
    NgxSmartModalService
  ]
})
export class HomeModule { }