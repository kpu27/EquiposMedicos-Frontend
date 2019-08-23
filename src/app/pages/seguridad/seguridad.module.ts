import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { QuillModule } from 'ngx-quill'
import { SharedModule } from '../../shared/shared.module';
import { PipesModule } from '../../theme/pipes/pipes.module';
import { SeguridadComponent } from './seguridad.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { PerfilesComponent } from './perfiles/perfiles.component';
import { MenuComponent } from './menu/menu.component';
import {TableModule} from 'primeng/table';
export const routes = [
  { path: '', component: SeguridadComponent, pathMatch: 'full' },
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'perfiles', component: PerfilesComponent },
  { path: 'menu', component: MenuComponent }
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
    TableModule
  ],
  declarations: [
    SeguridadComponent,
    UsuariosComponent,
    PerfilesComponent,
    MenuComponent
  ]
})
export class SeguridadModule { }