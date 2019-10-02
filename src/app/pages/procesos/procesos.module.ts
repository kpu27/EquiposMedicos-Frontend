import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule, PerfectScrollbarConfigInterface, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { QuillModule } from 'ngx-quill'
import { SharedModule } from '../../shared/shared.module';
import { PipesModule } from '../../theme/pipes/pipes.module';
import { ProcesosComponent } from './procesos.component';
import { CotizacionesComponent } from './cotizaciones/cotizaciones.component';
import { OrdenTrabajoComponent } from './orden-trabajo/orden-trabajo.component';
import {PrincipalComponent } from './orden-trabajo/principal/principal.component';
import { OrdenesTableComponent } from './orden-trabajo/ordenes-table/ordenes-table.component';
import {PaginatorModule} from 'primeng/paginator';
import {TableModule} from 'primeng/table';
import { ComponentsModule } from 'src/app/components/components.module';
import { CalendarModule } from 'angular-calendar';
import {CalendarModule as pCalendar} from 'primeng/calendar' ;
import {FullCalendarModule} from 'primeng/fullcalendar';
import { CotizacionesTableComponent } from './orden-trabajo/cotizaciones-table/cotizaciones-table.component';
import { TooltipModule } from '@swimlane/ngx-charts';
import { CalendarioComponent } from './orden-trabajo/calendario/calendario.component';
import { CalendarioDialogComponent } from './orden-trabajo/calendario/calendario-dialog/calendario-dialog.component';
import { MatListModule } from '@angular/material';
import {MatCheckboxModule} from '@angular/material/checkbox';

import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { CotizacionesFormComponent } from './cotizaciones/cotizaciones-form/cotizaciones-form.component';
import { CotizacionesListComponent } from './cotizaciones/cotizaciones-list/cotizaciones-list.component';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { DialogComponent } from './cotizaciones/dialog/dialog.component';
import { NgxPrintModule } from 'ngx-print';
registerLocaleData(es);

export const routes = [
  { path: '', component: ProcesosComponent, pathMatch: 'full' },
  { path: 'cotizaciones', component: CotizacionesComponent },
  { path: 'orden-trabajo', component: OrdenTrabajoComponent },
  { path: 'cotizaciones-form', component: CotizacionesTableComponent },
  { path: 'programar-orden', component: CotizacionesTableComponent},
//  { path: 'reporte-mantenimiento', component: ReporteMantenimientoComponent}
];

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
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
    PaginatorModule,
    TableModule,
    TooltipModule,
    ComponentsModule,
    CalendarModule.forRoot(),
    FullCalendarModule,
    MatListModule,
    MatCheckboxModule,
    NgxSmartModalModule.forRoot(),
    pCalendar,    
    NgxPrintModule
  ],
  declarations: [
    ProcesosComponent,
    CotizacionesComponent,
    OrdenTrabajoComponent,
    PrincipalComponent,
    OrdenesTableComponent,
    CotizacionesTableComponent,
    CalendarioComponent,
    CalendarioDialogComponent,
    ProcesosComponent,
    OrdenTrabajoComponent,
    CotizacionesFormComponent,
    CotizacionesListComponent,
    DialogComponent
  ],
  entryComponents: [
    CalendarioDialogComponent,
    DialogComponent
  ],
  providers:[
    { provide: LOCALE_ID, useValue: "es-ES" },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class ProcesosModule { }