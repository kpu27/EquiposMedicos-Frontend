import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from '../../shared/shared.module';
import { DashboardComponent } from './dashboard.component';
import { InfoCardsComponent } from './info-cards/info-cards.component';
import { CotizacionesComponent } from './cotizaciones/cotizaciones.component';
import { OrdenesComponent } from './ordenes/ordenes.component';
import { AdminGuard } from 'src/app/Guards/admin.guard';
export const routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full', CanActivate: [AdminGuard] }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    NgxChartsModule,
    PerfectScrollbarModule,
    SharedModule
  ],
  declarations: [
    DashboardComponent,
    InfoCardsComponent,
    CotizacionesComponent,
    OrdenesComponent
  ]
})
export class DashboardModule { }
