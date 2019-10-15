import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'angular-calendar';
import { SharedModule } from '../../shared/shared.module';
import { TecnicosComponent } from './tecnicos.component';
import { ScheduleDialogComponent } from './schedule-dialog/schedule-dialog.component';
import {MatCardModule, MatIconModule} from '@angular/material';
import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import {TableModule} from 'primeng/table';
import { MantenimientosRealizadosComponent } from './mantenimientos-realizados/mantenimientos-realizados.component';
registerLocaleData(es);
export const routes = [
  { path: '', component: TecnicosComponent, pathMatch: 'full' },
  { path: 'mantenimientos-r', component: MantenimientosRealizadosComponent },
  { path: 'reporte-mantenimiento', component: TecnicosComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    SharedModule,
    MatIconModule,
    MatCardModule,
    TableModule
  ],
  declarations: [
    TecnicosComponent, 
    ScheduleDialogComponent, 
    MantenimientosRealizadosComponent
  ],
  entryComponents: [
    ScheduleDialogComponent,
    TecnicosComponent
  ],
  providers:[
    { provide: LOCALE_ID, useValue: "es-ES" },
  ]
})
export class TecnicosModule { }