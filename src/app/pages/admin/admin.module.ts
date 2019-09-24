import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { QuillModule } from 'ngx-quill'
import { SharedModule } from '../../shared/shared.module';
import { PipesModule } from '../../theme/pipes/pipes.module';
import { AdminComponent } from './admin.component';
import { ActividadesComponent } from './actividades/actividades.component';
import { ProtocoloComponent } from './protocolo/protocolo.component';
import { InstrumentosComponent } from './instrumentos/instrumentos.component';
import { EquiposComponent } from './equipos/equipos.component';
import { ClientesComponent } from './clientes/clientes.component';
import { HttpClientModule } from '@angular/common/http';
import { AppService } from 'src/app/services/app.service';
import { ActividadesTableComponent } from './actividades/actividades-table/actividades-table.component';
import {TableModule} from 'primeng/table';
import {ListComponent} from './actividades/list/list.component';
import { ProtocolosTableComponent } from './protocolo/protocolos-table/protocolos-table.component';
import {TooltipModule} from 'primeng/tooltip';
import {DialogModule} from 'primeng/dialog';
import {CardModule} from 'primeng/card';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import { InstrumentosListComponent } from './instrumentos/instrumentos-list/instrumentos-list.component';
import { EquiposListComponent } from './equipos/equipos-list/equipos-list.component';
import { ClientesListComponent } from './clientes/clientes-list/clientes-list.component';
import { ActividadesFormComponent } from './actividades/actividades-form/actividades-form.component';
import {PaginatorModule} from 'primeng/paginator';
import { NgxSmartModalModule, NgxSmartModalService } from 'ngx-smart-modal';
import {MatIconModule} from '@angular/material/icon';
import { DropdownModule } from 'primeng/dropdown';
import {InputTextareaModule} from 'primeng/inputtextarea';
import { SpinnerModule } from 'primeng/spinner';
import { TecnicosComponent } from './tecnicos/tecnicos.component';
import { TecnicosTableComponent } from './tecnicos/tecnicos-table/tecnicos-table.component';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatDatepickerModule, MatInputModule } from '@angular/material';
/*import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxDaterangepickerMd } from 'ngx-datepicker-material';*/
import {CalendarModule as pCalendar} from 'primeng/calendar';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AdminGuard } from 'src/app/Guards/admin.guard';
import { EmpresasComponent } from './empresas/empresas.component';
export const routes = [
  { path: '', component: AdminComponent, pathMatch: 'full' },
  { path: 'actividades', component: ActividadesComponent, data: { breadcrumb: 'Actividades' },
  canActivate: [AdminGuard]},
  { path: 'protocolos', component: ProtocoloComponent, data: { breadcrumb: 'Protocolos' },
  canActivate: [AdminGuard]},
  { path: 'instrumentos', component: InstrumentosComponent, data: { breadcrumb: 'Instrumentos' },
  canActivate: [AdminGuard]},
  { path: 'equipos', component: EquiposComponent, data: { breadcrumb: 'Equipos' },
  canActivate: [AdminGuard]},
  { path: 'clientes', component: ClientesComponent, data: { breadcrumb: 'Clientes' },
  canActivate: [AdminGuard]},
  { path: 'form', component: ActividadesFormComponent, data: { breadcrumb: 'Clientes' },
  canActivate: [AdminGuard]},
  { path: 'tecnicos', component: TecnicosComponent, data: { breadcrumb: 'Tecnicos' },
  canActivate: [AdminGuard]}
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
    HttpClientModule,
    TableModule,
    TooltipModule,
    DialogModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    PaginatorModule,
    NgxSmartModalModule,
    MatIconModule,
    DropdownModule,
    InputTextareaModule,
    SpinnerModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    ToastrModule.forRoot(),
    /*NgxMaterialTimepickerModule,
    NgxDaterangepickerMd,*/
    pCalendar,
  ],
  declarations: [
    AdminComponent,
    ActividadesComponent,
    ProtocoloComponent,
    InstrumentosComponent,
    EquiposComponent,
    ClientesComponent,
    ActividadesTableComponent,
    ListComponent,
    ProtocolosTableComponent,
    InstrumentosListComponent,
    EquiposListComponent,
    ClientesListComponent,
    ActividadesFormComponent,
    TecnicosComponent,
    TecnicosTableComponent,
  ],
  providers: [
    AppService,
    NgxSmartModalService,
    ToastrService
  ]
})
export class AdminModule { }